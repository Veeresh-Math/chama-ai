from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import openai
import paypalrestsdk
from datetime import datetime
import random
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool

app = FastAPI(title="PayPal AI Community Hub API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class ConnectionRequest(BaseModel):
    openai_api_key: str
    paypal_client_id: str
    paypal_client_secret: str
    mode: str = "sandbox"

class CommunityRequest(BaseModel):
    name: str
    emails: List[str]
    contribution: float
    auto_distribute: bool

class GigRequest(BaseModel):
    title: str
    client_email: str
    budget: float
    milestones: List[str]

# --- SYSTEM STATE (In-memory for demo) ---
state = {
    "connected": False,
    "communities": [],
    "gig_jobs": [],
    "llm": None,
    "council": None,
    "agent_executor": None
}

# --- GARDEN-SKILLS LOGIC ---
class CommunitySavingsSkill:
    def analyze_trust(self, name: str, history: str):
        score = random.randint(70, 95) if "consistent" in history else random.randint(40, 69)
        return {"trust_score": score, "status": "Verified"}

class AgentCouncil:
    def __init__(self, llm):
        self.llm = llm
        self.agents = {
            "Trust": "Analyze social reliability and historical contribution patterns.",
            "Compliance": "Check against PayPal's regulatory constraints and fraud patterns.",
            "Treasury": "Verify fund availability and stablecoin (PYUSD) liquidity."
        }

    def deliberate(self, transaction_type: str, details: Dict) -> Dict:
        results = {}
        consensus = True
        for agent_name, role in self.agents.items():
            prompt = f"Role: {role}\nTransaction: {transaction_type}\nDetails: {details}\n\nVerdict: [APPROVE/REJECT] and a one-sentence reason."
            response = self.llm.invoke(prompt)
            verdict = "APPROVE" if "APPROVE" in response.content.upper() else "REJECT"
            results[agent_name] = {"verdict": verdict, "reason": response.content}
            if verdict == "REJECT":
                consensus = False
        return {"consensus": consensus, "details": results}

# --- PAYPAL TOOLS ---
@tool
def create_paypal_payment(amount: float, currency: str, recipient: str, description: str) -> str:
    """Execute a PayPal payment."""
    try:
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "redirect_urls": {"return_url": "http://localhost:3000/success", "cancel_url": "http://localhost:3000/cancel"},
            "transactions": [{"amount": {"total": f"{amount:.2f}", "currency": currency}, "description": description}]
        })
        if payment.create(): return f"Payment executed. ID: {payment.id}"
        return f"Payment failed: {payment.error}"
    except Exception as e: return f"Error: {str(e)}"

@tool
def create_split_payment(amount: float, currency: str, recipients: list, description: str) -> str:
    """Execute a split PayPal payout."""
    try:
        payouts = paypalrestsdk.Payout({
            "sender_batch_header": {"sender_batch_id": f"comm_{datetime.now().timestamp()}", "email_subject": "Community distribution"},
            "items": [{"recipient_type": "EMAIL", "amount": {"value": f"{float(r['share']):.2f}", "currency": currency}, "receiver": r['email']} for r in recipients]
        })
        if payouts.create(): return f"Split payout executed. Batch ID: {payouts.batch_header.payout_batch_id}"
        return f"Split payout failed: {payouts.error}"
    except Exception as e: return f"Error: {str(e)}"

# --- API ENDPOINTS ---

@app.post("/connect")
async def connect(req: ConnectionRequest):
    try:
        openai.api_key = req.openai_api_key
        paypalrestsdk.configure({"mode": req.mode, "client_id": req.paypal_client_id, "client_secret": req.paypal_client_secret})
        
        llm = ChatOpenAI(model="gpt-4o", api_key=req.openai_api_key)
        state["llm"] = llm
        state["council"] = AgentCouncil(llm)
        
        tools = [create_paypal_payment, create_split_payment]
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Lead Orchestrator for PayPal's Community Hub. Coordinate between the Agent Council and PayPal API. Precision over politeness."),
            ("user", "{input}"),
            ("agent_scratchpad", "{agent_scratchpad}")
        ])
        from langchain.agents import create_openai_functions_agent
        agent = create_openai_functions_agent(llm, tools, prompt)
        
        # Using a dynamic import to avoid top-level crash
        try:
            from langchain.agents import AgentExecutor as AE
            executor = AE(agent=agent, tools=tools, verbose=True)
        except ImportError:
            # Fallback to a simplified execution pattern if AgentExecutor is missing from the namespace
            executor = agent
            
        state["agent_executor"] = executor
        state["connected"] = True
        
        return {"status": "connected", "message": "Agent Council Online"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/community/create")
async def create_community(req: CommunityRequest):
    if not state["connected"]: raise HTTPException(status_code=401, detail="System not connected")
    
    skill = CommunitySavingsSkill()
    trust_result = skill.analyze_trust(req.name, "consistent")
    
    new_community = {
        "id": len(state["communities"]) + 1,
        "name": req.name,
        "members": [{"email": e, "share": 0} for e in req.emails],
        "contribution": req.contribution,
        "trust_score": trust_result["trust_score"],
        "total_funds": 0
    }
    state["communities"].append(new_community)
    return new_community

@app.get("/communities")
async def get_communities():
    return state["communities"]

@app.post("/community/distribute/{community_id}")
async def distribute_funds(community_id: int):
    if not state["connected"]: raise HTTPException(status_code=401, detail="System not connected")
    
    comm = next((c for c in state["communities"] if c["id"] == community_id), None)
    if not comm: raise HTTPException(status_code=404, detail="Community not found")
    
    details = {"community": comm["name"], "amount": comm["total_funds"], "members": len(comm["members"])}
    council_result = state["council"].deliberate("Community Payout", details)
    
    if council_result["consensus"]:
        recipients = [{"email": m['email'], "share": comm['total_funds']/len(comm['members'])} for m in comm['members']]
        result = state["agent_executor"].invoke({"input": f"Create a split payment of ${comm['total_funds']} to these members: {recipients}"})
        return {"status": "approved", "output": result["output"]}
    
    return {"status": "rejected", "details": council_result["details"]}

@app.post("/gig/create")
async def create_gig(req: GigRequest):
    if not state["connected"]: raise HTTPException(status_code=401, detail="System not connected")
    
    new_gig = {
        "id": len(state["gig_jobs"]) + 1,
        "title": req.title,
        "client_email": req.client_email,
        "budget": req.budget,
        "milestones": [{"name": m, "completed": False} for m in req.milestones],
        "completed": False
    }
    state["gig_jobs"].append(new_gig)
    return new_gig

@app.get("/gigs")
async def get_gigs():
    return state["gig_jobs"]

@app.post("/gig/complete/{milestone_idx}")
async def complete_milestone(gig_id: int, milestone_idx: int):
    # Logic for completing milestones and triggering council
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
