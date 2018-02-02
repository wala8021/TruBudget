export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';

export const CREATE_PROJECT = 'CREATE_PROJECT';
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export const SHOW_PROJECT_DIALOG = 'SHOW_PROJECT_DIALOG'
export const HIDE_PROJECT_DIALOG = 'HIDE_PROJECT_DIALOG'
export const PROJECT_NAME = 'PROJECT_NAME';
export const PROJECT_AMOUNT = 'PROJECT_AMOUNT';
export const PROJECT_COMMENT = 'PROJECT_COMMENT';
export const PROJECT_CURRENCY = 'PROJECT_CURRENCY';
export const PROJECT_THUMBNAIL = 'PROJECT_THUMBNAIL';
export const SET_PROJECT_CREATION_STEP = 'SET_PROJECT_CREATION_STEP';

export const ADD_ASSIGNEMENT_ROLE = 'ADD_ASSIGNEMENT_ROLE';
export const ADD_APPROVER_ROLE = 'ADD_APPROVER_ROLE';
export const ADD_BANK_ROLE = 'ADD_BANK_ROLE';
export const REMOVE_ASSIGNEMENT_ROLE = 'REMOVE_ASSIGNEMENT_ROLE';
export const REMOVE_APPROVER_ROLE = 'REMOVE_APPROVER_ROLE';
export const REMOVE_BANK_ROLE = 'REMOVE_BANK_ROLE';

export function fetchProjects() {
  return {
    type: FETCH_PROJECTS,
  }
}

export function createProject(name, amount, comment, currency, approver, assignee, bank, thumbnail) {
  return {
    type: CREATE_PROJECT,
    name,
    amount,
    comment,
    currency,
    approver,
    assignee,
    bank,
    thumbnail
  }
}

export function showProjectDialog(show) {
  return {
    type: SHOW_PROJECT_DIALOG,
  }
}
export function hideProjectDialog(show) {
  return {
    type: HIDE_PROJECT_DIALOG,
  }
}

export function storeProjectName(name) {
  return {
    type: PROJECT_NAME,
    name: name
  }
}

export function storeProjectAmount(amount) {
  return {
    type: PROJECT_AMOUNT,
    amount: amount
  }
}

export function storeProjectCurrency(currency) {
  return {
    type: PROJECT_CURRENCY,
    currency: currency
  }
}

export function storeProjectComment(comment) {
  return {
    type: PROJECT_COMMENT,
    comment: comment
  }
}

export function storeProjectThumbnail(thumbnail) {
  return {
    type: PROJECT_THUMBNAIL,
    thumbnail: thumbnail
  }
}


export function setProjectCreationStep(step) {
  return {
    type: SET_PROJECT_CREATION_STEP,
    step
  }
}

export function addAssignmentRole(role) {
  return {
    type: ADD_ASSIGNEMENT_ROLE,
    role
  }
}

export function addApproverRole(role) {
  return {
    type: ADD_APPROVER_ROLE,
    role
  }
}
export function addBankRole(role) {
  return {
    type: ADD_BANK_ROLE,
    role
  }
}

export function removeAssignmentRole(index) {
  return {
    type: REMOVE_ASSIGNEMENT_ROLE,
    index
  }
}

export function removeApproverRole(index) {
  return {
    type: REMOVE_APPROVER_ROLE,
    index
  }
}
export function removeBankRole(index) {
  return {
    type: REMOVE_BANK_ROLE,
    index
  }
}

