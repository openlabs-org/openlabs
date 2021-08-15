import { fetchAll as fetchProjects } from "./ProjectRepository";
export const fetchAll = async ({ desiloContract, ceramic }) => {
  let groups = await desiloContract.methods.getAllGroups().call();
  let groupURIs = groups.map((elem) => ({ streamId: elem.uri }));
  let groupCeramic = await ceramic.multiQuery(groupURIs);
  let groupDict = Object.keys(groupCeramic).map((key, index) => {
    let content = Object.assign({}, groupCeramic[key].content, groups[index]);
    content.id = index;

    return content;
  });
  return groupDict;
};

export const fetch = async ({ desiloContract, ceramic }, id) => {
  let stream = await fetchAll({ desiloContract, ceramic });
  return Promise.resolve(stream.find((project) => project.id === id));
};

export const fetchDetailed = async ({ desiloContract, ceramic, idx }, id) => {
  let group = await fetch({ desiloContract, ceramic }, id);
  let allAffiliated = await desiloContract.methods.getAllAffiliations().call();
  let allVouches = await desiloContract.methods.getAllVouched().call();
  let projects = await fetchProjects({ desiloContract, ceramic, idx });
  let groupPending = Object.keys(allVouches).filter(
    (projectID) =>
      parseFloat(allVouches[projectID][id]) > 0 && !allAffiliated[projectID][id]
  );
  let groupAffiliated = Object.keys(allAffiliated).filter(
    (projectID) => allAffiliated[projectID][id]
  );

  let projectsPending = groupPending.map((index) => {
    let content = projects[index];
    content.vouches = allVouches[index][id];
    return content;
  });
  let projectsAffiliated = groupAffiliated.map((index) => projects[index]);

  group.pending = projectsPending;
  group.affiliated = projectsAffiliated;
  console.log(group);
  return group;
};

export const add = (data) => {
  groups.push({
    id: groups.length + 1,
    ...data,
  });
  return Promise.resolve(
    groups.find((project) => project.id === project.length)
  );
};

export const update = (id, data) => {
  return Promise.resolve({
    ...groups.find((project) => project.id === id),
    ...data,
  });
};

export const remove = (id) => {
  const index = groups.findIndex((project) => project.id === id);
  groups.splice(index, 1);
  return Promise.resolve(true);
};

let groups = [
  {
    id: 1,
    name: "Group A",
    description: "Lorem ipsum",
  },
  {
    id: 2,
    name: "Group B",
    description: "Lorem ipsum",
  },
  {
    id: 3,
    name: "Group C",
    description: "Lorem ipsum",
  },
];

let groupDetailed = {
  id: 0,
  name: "Group A",
  token: "GA",
  affiliated: [],
  pending: [],
};
