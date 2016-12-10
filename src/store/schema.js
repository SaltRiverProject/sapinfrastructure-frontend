import { Schema, arrayOf } from 'normalizr'

const Tiers = new Schema('tiers')
const Users = new Schema('users')
const Group = new Schema('groups')
const Servers = new Schema('servers')
const Roles = new Schema('roles')
const Locations = new Schema('locations')
const Components = new Schema('components')

const arrayOfTiers = arrayOf(Tiers)
const arrayOfUsers = arrayOf(Users)
const arrayOfGroups = arrayOf(Group)
const arrayOfServers = arrayOf(Servers)
const arrayOfLocations = arrayOf(Locations)
const arrayOfRoles = arrayOf(Roles)
const arrayOfComponent = arrayOf(Components)

Users.define({
  groups: Group
})
Tiers.define({
  servers: arrayOfServers,
  createdBy: Users,
  updatedBy: Users
})
Roles.define({
  servers: arrayOfServers,
  createdBy: Users,
  updatedBy: Users
})
Locations.define({
  servers: arrayOfServers,
  createdBy: Users,
  updatedBy: Users
})
Components.define({
  servers: arrayOfServers,
  createdBy: Users,
  updatedBy: Users
})
Servers.define({
  tier: Tiers,
  component: Components,
  roles: arrayOfRoles,
  location: Locations,
  createdBy: Users,
  updatedBy: Users
})

export {
  Tiers,
  Users,
  Group,
  Servers,
  Roles,
  Locations,
  Components,
  arrayOfTiers,
  arrayOfUsers,
  arrayOfGroups,
  arrayOfServers,
  arrayOfLocations,
  arrayOfRoles,
  arrayOfComponent
}
