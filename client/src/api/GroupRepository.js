export const fetchAll = () => {
  return Promise.resolve(groups)
}

export const fetch = (id) => {
  return Promise.resolve(groups.find(project => project.id === id))
}

export const add = (data) => {
  groups.push({
    id: groups.length + 1,
    ...data
  })
  return Promise.resolve(groups.find(project => project.id === project.length))
}

export const update = (id, data) => {
  return Promise.resolve({
    ...groups.find(project => project.id === id),
    ...data
  })
}

export const remove = (id) => {
  const index = groups.findIndex(project => project.id === id)
  groups.splice(index, 1)
  return Promise.resolve(true)
}

let groups = [
  {
    id: 1,
    name: 'Group A',
    description: 'Lorem ipsum'
  },
  {
    id: 2,
    name: 'Group B',
    description: 'Lorem ipsum'
  },
  {
    id: 3,
    name: 'Group C',
    description: 'Lorem ipsum'
  }
]