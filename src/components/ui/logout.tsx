import React from 'react'
import { Button } from './button'
import { handleLogout } from '@/lib/queries/auth'

type Props = {}

const LogoutButton = (props: Props) => {
  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutButton