import * as React from "react"

interface CardProps {
  className?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    ].filter(Boolean).join(" ")

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

interface CardHeaderProps {
  className?: string
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "flex flex-col space-y-2 p-6",
      className,
    ].filter(Boolean).join(" ")

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
CardHeader.displayName = "CardHeader"

interface CardTitleProps {
  className?: string
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    ].filter(Boolean).join(" ")

    return (
      <h3
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
CardTitle.displayName = "CardTitle"

interface CardDescriptionProps {
  className?: string
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "text-sm text-muted-foreground",
      className,
    ].filter(Boolean).join(" ")

    return (
      <p
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
CardDescription.displayName = "CardDescription"

interface CardContentProps {
  className?: string
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "p-6 pt-0",
      className,
    ].filter(Boolean).join(" ")

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
CardContent.displayName = "CardContent"
