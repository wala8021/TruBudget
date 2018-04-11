type Intent =
  | "root.permission.list"
  | "root.permission.grant"
  | "root.permission.revoke"
  | "user.list"
  | "user.create"
  | "user.authenticate"
  | "project.list" // IDs + meta data
  | "project.view" // ID + meta data + allowed intents + history
  | "project.create"
  | "project.assign"
  | "project.update"
  | "project.close"
  | "project.archive"
  | "project.permission.list"
  | "project.permission.grant"
  | "project.permission.revoke"
  | "subproject.list"
  | "subproject.view"
  | "subproject.create"
  | "subproject.assign"
  | "subproject.update"
  | "subproject.close"
  | "subproject.archive"
  | "subproject.permission.list"
  | "subproject.permission.grant"
  | "subproject.permission.revoke"
  | "workflowitem.list"
  | "workflowitem.view"
  | "workflowitem.create"
  | "workflowitem.assign"
  | "workflowitem.update"
  | "workflowitem.close"
  | "workflowitem.archive"
  | "workflowitem.permission.list"
  | "workflowitem.permission.grant"
  | "workflowitem.permission.revoke";

export const globalIntents: Intent[] = [
  "root.permission.list",
  "root.permission.grant",
  "root.permission.revoke",
  "user.list",
  "user.create",
  "user.authenticate",
  "project.list",
  "project.create"
];

export const defaultGlobalUserIntents: Intent[] = ["user.authenticate", "project.list"];

export default Intent;
