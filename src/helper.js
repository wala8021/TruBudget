import React from 'react';
import moment from 'moment';
import OpenIcon from 'material-ui/svg-icons/navigation/close';
import InProgressIcon from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';
import DoneIcon from 'material-ui/svg-icons/navigation/check';
import accounting from 'accounting';
import _ from 'lodash';
import strings from './localizeStrings'
import currencies from './currency';

import { taskStatusColorPalette, budgetStatusColorPalette, workflowBudgetColorPalette } from './colors';

const getCurrencyFormat = (currency) => ({ decimal: ".", thousand: ",", precision: 2, ...currencies[currency] })

export const fromAmountString = (amount, currency) => accounting.unformat(amount, getCurrencyFormat(currency).decimal);
export const toAmountString = (amount, currency) => accounting.formatMoney(amount, getCurrencyFormat(currency));

export const tsToString = (ts) => {
  let dateString = moment(ts, 'x').format("MMM D, YYYY");
  return dateString;
}
export const typeMapping = {
  workflow: strings.workflow.workflow_type_workflow,
  transaction: strings.workflow.workflow_type_transaction
}

export const statusMapping = {
  done: strings.common.done,
  'in_review': strings.common.in_review,
  'in_progress': strings.common.in_progress,
  open: strings.common.open
}

export const amountTypes = {
  na: strings.workflow.workflow_budget_status_na,
  allocated: strings.workflow.workflow_budget_status_allocated,
  disbursed: strings.workflow.workflow_budget_status_disbursed
}

export const statusIconMapping = {
  done: <DoneIcon />,
  'in_progress': <InProgressIcon />,
  open: <OpenIcon />,
}

const actionMapping = (assignee, bank, approver) => ({
  'in_review': `${strings.workflow.workflow_action_in_review} ${approver}`,
  pending: `${strings.workflow.workflow_action_pending_approval} ${bank}`,
  'in_progress': `${strings.workflow.workflow_action_open_in_progress}  ${assignee}`,
  open: `${strings.workflow.workflow_action_open_in_progress} ${assignee}`,
})

export const roleMapper = {
  'approver': strings.common.approver,
  'bank': strings.common.bank,
  'assignee': strings.common.assignee
}



const createDoughnutData = (labels, data, colors = taskStatusColorPalette, ) => ({
  labels,
  datasets: [
    {
      data: data,
      backgroundColor: colors,
      hoverBackgroundColor: colors,
    }
  ]
});

export const calculateUnspentAmount = (items) => {
  const amount = items.reduce((acc, item) => {
    return acc + parseInt(item.details.amount, 10)
  }, 0);
  return amount;
}

export const calculateWorkflowBudget = (workflows) => {
  return workflows.reduce((acc, workflow) => {
    const { amount, amountType } = workflow.data;
    const next = {
      assigned: amountType === 'allocated' ? acc.assigned + amount : acc.assigned,
      disbursed: amountType === 'disbursed' ? acc.disbursed + amount : acc.disbursed
    }
    return next;
  }, { assigned: 0, disbursed: 0 })
}

export const createAmountData = (projectAmount, subProjects) => {
  const subProjectsAmount = calculateUnspentAmount(subProjects)
  const unspent = projectAmount - subProjectsAmount;
  return createDoughnutData([strings.common.assigned, strings.common.not_assigned], [subProjectsAmount, unspent < 0 ? 0 : unspent], budgetStatusColorPalette);
}

export const getNotAssignedBudget = (amount, assignedBudget, disbursedBudget) => {
  const notAssigned = amount - assignedBudget - disbursedBudget;
  return notAssigned >= 0 ? notAssigned : 0;
}

export const createSubprojectAmountData = (subProjectAmount, workflows) => {
  const { assigned, disbursed } = calculateWorkflowBudget(workflows);


  const budgetLeft = getNotAssignedBudget(subProjectAmount, assigned, disbursed);
  return createDoughnutData([strings.common.not_assigned_budget, strings.common.assigned_budget, strings.common.disbursed_budget], [budgetLeft, assigned, disbursed], workflowBudgetColorPalette)
}

export const getProgressInformation = (items) => {
  let startValue = {
    open: 0,
    inProgress: 0,
    inReview: 0,
    done: 0
  }
  const projectStatus = items.reduce((acc, item) => {
    const status = item.details.status;
    return {
      open: status === 'open' ? acc.open + 1 : acc.open,
      inProgress: status === 'in_progress' ? acc.inProgress + 1 : acc.inProgress,
      inReview: status === 'in_review' ? acc.inReview + 1 : acc.inReview,
      done: status === 'done' ? acc.done + 1 : acc.done,
    };
  }, startValue);
  return projectStatus;
}


export const createTaskData = (items, type) => {
  const projectStatus = getProgressInformation(items)
  if (type === 'workflows') {
    return createDoughnutData([strings.common.open, strings.common.in_progress, strings.common.in_review, strings.common.done], [projectStatus.open, projectStatus.inProgress, projectStatus.inReview, projectStatus.done]);
  }
  return createDoughnutData([strings.common.open, strings.common.in_progress, strings.common.done], [projectStatus.open, projectStatus.inProgress, projectStatus.done]);
}

export const getNextIncompletedItem = (items) => {
  return items.find((item) => item.details.status === 'open' | item.details.status === 'in_progress' | item.details.status === 'in_review');
}

export const getNextAction = (item, assignee, bank, approver) => {
  return !_.isUndefined(item) && !_.isUndefined(item.details.status)
    && !_.isEmpty(item.details.status)
    ? actionMapping(assignee, bank, approver)[item.details.status]
    : "No actions required "
}


export const getAssignedOrganization = (organizations) => organizations.reduce((acc, organization, index) => {
  const nextString = index ? `, ${organization}` : `${organization}`
  return acc + nextString;
}, "")
