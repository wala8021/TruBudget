import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import TBDIcon from "@material-ui/icons/Remove";
import _isEqual from "lodash/isEqual";
import React from "react";
import strings from "../../localizeStrings";
import OverflowTooltip from "../Common/OverflowTooltip";

/**
 ** @actions Displayed by the table in following format
 **
 ** action: {
 **   displayName: string - Display Name of the project/subproject/workflowitem
 **   intent: string      - e.g. project.intent.listPermissions
 **
 ** }
 */

const styles = {
  card: {
    marginTop: "24px"
  },
  container: {
    height: "180px"
  },
  tableBody: {
    display: "flex",
    flexDirection: "column"
  },
  textRow: {
    display: "flex",
    height: "40px"
  },
  headerRow: {
    display: "flex",
    height: "40px"
  },
  headerCell: {
    fontSize: "16px",
    textAlign: "left",
    flex: "1",
    borderBottom: "unset",
    padding: "0px"
  },
  columnHeaderCell: {
    fontSize: "14px",
    fontWeight: "bold",
    alignSelf: "center",
    flex: "1",
    padding: "0px 3px 4px 8px",
    backgroundColor: "transparent"
  },
  tableRow: {
    display: "flex",
    minHeight: "30px",
    borderBottom: "unset"
  },
  tableCell: {
    fontSize: "14px",
    borderBottom: "unset",
    padding: "0px 3px 4px 8px",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    '& div': {
      width: '150px'
    }
  }
};

function generateHeader(classes, status) {
  return (
    <TableRow className={classes.headerRow} key={"header"}>
      <TableCell key={"header-type"} className={classes.columnHeaderCell} style={{ flex: 2 }}>
        {strings.common.type}
      </TableCell>
      <TableCell key={"header-displayName"} className={classes.columnHeaderCell} style={{ flex: 3 }}>
        {strings.common.name}
      </TableCell>
      <TableCell key={"header-permission"} className={classes.columnHeaderCell} style={{ flex: 3 }}>
        {strings.common.permission}
      </TableCell>
      <TableCell key={"header-identity"} className={classes.columnHeaderCell} style={{ flex: 3 }}>
        {strings.confirmation.user_group}
      </TableCell>
      {status ? (
        <TableCell key={"header-status"} className={classes.columnHeaderCell} style={{ textAlign: "right", flex: 2 }}>
          {strings.common.status}
        </TableCell>
      ) : null}
    </TableRow>
  );
}

function generateActions(classes, actions, executedActions, failedAction, userList, status) {
  const actionsTable = [];
  actions.forEach((action, index) => {
    const type = strings.common[action.intent.split(".")[0]];
    const user = userList.find(user => user.id === action.identity);
    actionsTable.push(
      <TableRow className={classes.tableRow} key={index + "-" + action.displayName + "-" + action.permission}>
        <TableCell key={index + "-type"} className={classes.tableCell} style={{ flex: 2 }}>
          {type}
        </TableCell>
        <TableCell key={index + "-displayName"} className={classes.tableCell} style={{ flex: 3 }}>
          <OverflowTooltip text={action.displayName} />
        </TableCell>
        <TableCell key={index + "-permission"} className={classes.tableCell} style={{ flex: 3 }}>
          <OverflowTooltip text={makePermissionReadable(action.permission)} />
        </TableCell>
        <TableCell key={index + "-userName"} className={classes.tableCell} style={{ flex: 3 }}>
          <OverflowTooltip text={user ? user.displayName : ""} />
        </TableCell>
        {status ? (
          <TableCell
            key={index + "-status"}
            className={classes.tableCell}
            style={{ textAlign: "right", position: "relative", bottom: "4px", flex: 2 }}
          >
            {getStatusIcon(executedActions, failedAction, action)}
          </TableCell>
        ) : null}
      </TableRow>
    );
  });
  return actionsTable;
}

function getStatusIcon(executedActions, failedAction, action) {
  if (executedActions === undefined || _isEqual(action, failedAction)) {
    return <ErrorIcon />;
  } else {
    if (actionExecuted(executedActions, action)) {
      return <DoneIcon />;
    } else {
      return <TBDIcon />;
    }
  }
}

const actionExecuted = (executedActions, action) => {
  return executedActions.some(
    item =>
      action.id === item.id &&
      action.identity === item.identity &&
      action.intent === item.intent &&
      action.permission === item.permission
  );
};

function makePermissionReadable(intent) {
  const splittedString = intent.split(".");
  return strings.intents[splittedString[splittedString.length - 1]] || splittedString[splittedString.length - 1];
}

const ActionsTable = props => {
  const { classes, actions, executedActions, executingActions, failedAction, userList, status = true } = props;
  return actions ? (
    <>
      <Card className={classes.card}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" data-test="actions-table">
            <TableHead data-test="actions-table-head" key={"wrapper"}>
              {generateHeader(classes, status)}
            </TableHead>
            <TableBody data-test="actions-table-body" className={classes.tableBody}>
              {generateActions(classes, actions, executedActions, failedAction, userList, status)}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {executingActions ? <LinearProgress color="primary" /> : null}
    </>
  ) : null;
};

export default withStyles(styles)(ActionsTable);
