import { assert } from "chai";

import { Ctx } from "../../../lib/ctx";
import * as Result from "../../../result";
import { BusinessEvent } from "../business_event";
import { NotAuthorized } from "../errors/not_authorized";
import { NotFound } from "../errors/not_found";
import { ServiceUser } from "../organization/service_user";
import { Permissions } from "../permissions";
import { Workflowitem } from "./workflowitem";
import { Filter, getHistory } from "./workflowitem_history_get";
import { WorkflowitemTraceEvent } from "./workflowitem_trace_event";

const ctx: Ctx = { requestId: "", source: "test" };
const root: ServiceUser = { id: "root", groups: [] };
const alice: ServiceUser = { id: "alice", groups: [] };
const projectId = "dummy-project";
const subprojectId = "dummy-subproject";
const workflowitemId = "dummy-workflowitem";
const date = new Date().toISOString();

const filter: Filter = {
  publisher: alice.id,
  startAt: date,
  endAt: date,
  eventType: "workflowitem_created",
};

const permissions: Permissions = {
  "workflowitem.view": ["alice"],
};

const event: WorkflowitemTraceEvent = {
  entityId: alice.id,
  entityType: "workflowitem",
  businessEvent: {
    type: "workflowitem_created",
    source: "",
    time: date,
    publisher: alice.id,
    projectId,
    subprojectId,
    workflowitem: {
      id: subprojectId,
      status: "open",
      displayName: "subproject",
      description: "some description",
      currency: "",
      permissions: {},
      additionalData: {},
      amountType: "N/A",
      documents: [],
    },
  },
  snapshot: {
    displayName: "",
    amount: "",
    currency: "string",
    amountType: "",
  },
};

const baseWorkflowitem: Workflowitem = {
  isRedacted: false,
  id: workflowitemId,
  subprojectId,
  createdAt: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  status: "open",
  displayName: "dummy",
  description: "dummy",
  amountType: "N/A",
  documents: [],
  permissions,
  log: [event],
  additionalData: {},
  workflowitemType: "general",
};

const baseRepository = {
  getWorkflowitem: async () => baseWorkflowitem,
};

describe("get worklfowitem history: authorization", () => {
  it("Without the required permissions, a user cannot get a worklfowitem's history.", async () => {
    const notPermittedWorkflowitem: Workflowitem = {
      ...baseWorkflowitem,
      permissions: {},
    };
    const result = await getHistory(ctx, alice, projectId, subprojectId, workflowitemId, filter, {
      ...baseRepository,
      getWorkflowitem: async () => notPermittedWorkflowitem,
    });
    assert.instanceOf(result, NotAuthorized);
  });

  it("With the required permissions, a user can get a worklfowitem's history.", async () => {
    const result = await getHistory(
      ctx,
      alice,
      projectId,
      subprojectId,
      workflowitemId,
      filter,
      baseRepository,
    );
    assert.isTrue(Result.isOk(result), (result as Error).message);
  });

  it("The root user doesn't need permission to get a worklfowitem's history.", async () => {
    const result = await getHistory(
      ctx,
      root,
      projectId,
      subprojectId,
      workflowitemId,
      filter,
      baseRepository,
    );
    assert.isTrue(Result.isOk(result), (result as Error).message);
  });
});
describe("get workflowitem history: preconditions", () => {
  it("Getting a workflowitem's history fails if the workflowitem cannot be found", async () => {
    const result = await getHistory(ctx, alice, projectId, subprojectId, workflowitemId, filter, {
      ...baseRepository,
      getWorkflowitem: async () => new Error("some error"),
    });
    assert.isTrue(Result.isErr(result));
    assert.instanceOf(result, NotFound);
  });

  it("the properties of the filter must match the resulted properties exactly", async () => {
    const result = await getHistory(
      ctx,
      root,
      projectId,
      subprojectId,
      workflowitemId,
      filter,
      baseRepository,
    );
    assert.equal(result[0].businessEvent.publisher, alice.id);
    assert.isTrue(result[0].businessEvent.time >= filter.startAt);
    assert.isTrue(result[0].businessEvent.time <= filter.endAt);
    assert.equal(result[0].businessEvent.type, filter.eventType);
  });

  it("if one property of the result doesn't match the filter the event is not returned", async () => {
    const editedFilter: Filter = {
      ...filter,
      publisher: root.id,
    };
    const result = await getHistory(
      ctx,
      root,
      projectId,
      subprojectId,
      workflowitemId,
      editedFilter,
      baseRepository,
    );
    assert.isTrue(Result.isOk(result), (result as Error).message);
    assert.isEmpty(result);
  });
  it("if there are more events in a workflowitem's history only the one matching the filter is returned", async () => {
    const anotherBusinessEvent: BusinessEvent = {
      type: "workflowitem_closed",
      source: "",
        time: date,
        publisher: alice.id,
        projectId,
        subprojectId,
        workflowitemId,
    };
    const newEvent: WorkflowitemTraceEvent = {
      ...event,
      businessEvent: anotherBusinessEvent,
    };
    const updatedWorkflowitem: Workflowitem = {
        ...baseWorkflowitem,
        log: [event, newEvent],
    };

    const result = await getHistory(
      ctx,
      root,
      projectId,
      subprojectId,
      workflowitemId,
      filter,
      {
        getWorkflowitem: async () => updatedWorkflowitem,

      },
    );
    assert.equal(Result.unwrap(result).length, 1);
    assert.equal(result[0].businessEvent.publisher, alice.id);
    assert.isTrue(result[0].businessEvent.time >= filter.startAt);
    assert.isTrue(result[0].businessEvent.time <= filter.endAt);
    assert.equal(result[0].businessEvent.type, filter.eventType);
  });
});
