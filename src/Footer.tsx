import React from 'react'

function ExternalLink({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-500"
    >
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <div className="col-span-full mt-4 text-center text-sm">
      Made with ♥ by{' '}
      <ExternalLink href="https://raygesualdo.com">Ray Gesualdo</ExternalLink> |
      Open sourced on{' '}
      <ExternalLink href="https://github.com/raygesualdo/web-palette-creator">
        GitHub
      </ExternalLink>
    </div>
  )
}
