import React from "react";
import Divider from "@material-ui/core/Divider";
import strings from "../../localizeStrings";
import Budget from "../Common/Budget";
import Identifier from "../Common/Identifier";
import Dropdown from "../Common/NewDropdown";
import AssigneeSelection from "../Common/AssigneeSelection";
import { getCurrencies } from "../../helper";
import MenuItem from "@material-ui/core/MenuItem";
import {
  types as workflowitemTypes,
  typesDescription as workflowitemTypesescription
} from "../Workflows/workflowitemTypes";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const subprojectWorkflowItemTypes = ["any", ...workflowitemTypes];
const subprojectWorkflowItemTypesDescription = { notSelected: "any - Description", ...workflowitemTypesescription };

const styles = {
  dropdown: {
    minWidth: 200
  },
  inputContainer: {
    width: "100%",
    display: "flex"
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 15,
    padding: 8
  },
  deleteButton: {
    width: "30px",
    height: "30px",
    marginTop: 15,
    padding: 8
  },
  container: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly"
    // justifyContent: "space-between"
  },
  validatorContainer: {
    marginTop: 8,
    minWidth: 200
  }
};

function getMenuItems(currencies) {
  return currencies.map((currency, index) => {
    return (
      <MenuItem key={index} value={currency.value}>
        {currency.primaryText}
      </MenuItem>
    );
  });
}

const getDropdownMenuItems = types => {
  return types.map((type, index) => {
    return (
      <MenuItem key={index} value={type}>
        {type}
      </MenuItem>
    );
  });
};

const getDropdownValidator = users => {
  return users.map((user, index) => {
    return (
      <MenuItem key={index} value={user.id}>
        {user.displayName}
      </MenuItem>
    );
  });
};

const getWorkflowitemTypeInfo = type => {
  switch (type) {
    case "any":
      return subprojectWorkflowItemTypesDescription.notSelected;
    case "general":
      return subprojectWorkflowItemTypesDescription.general;
    case "restricted":
      return subprojectWorkflowItemTypesDescription.restricted;
    default:
      return subprojectWorkflowItemTypesDescription.notSelected;
  }
};

const SubprojectDialogContent = props => {
  const currencies = getCurrencies();
  return (
    <div>
      <div>
        <Identifier
          nameLabel={strings.subproject.subproject_title}
          nameHintText={strings.subproject.subproject_title_description}
          name={props.subprojectToAdd.displayName}
          nameOnChange={props.storeSubProjectName}
          commentLabel={strings.subproject.subproject_comment}
          commentHintText={strings.common.comment_description}
          comment={props.subprojectToAdd.description}
          commentOnChange={props.storeSubProjectComment}
        />
        {!props.editDialogShown ? (
          <div style={styles.container}>
            <div style={styles.inputContainer}>
              <Dropdown
                style={styles.dropdown}
                value={props.subprojectToAdd.currency}
                floatingLabel={strings.subproject.subproject_currency}
                onChange={v => props.storeSubProjectCurrency(v)}
                id="sp-dialog-currencies"
              >
                {getMenuItems(currencies)}
              </Dropdown>
            </div>

            <div style={styles.inputContainer}>
              <Dropdown
                style={styles.dropdown}
                floatingLabel={strings.workflow.workflowitem_type}
                value={props.selectedWorkflowitemType}
                onChange={value => props.storeFixedWorkflowitemType(value)}
                id="types"
              >
                {getDropdownMenuItems(subprojectWorkflowItemTypes)}
              </Dropdown>
              <Tooltip title={getWorkflowitemTypeInfo(props.selectedWorkflowitemType)} placement="right">
                <InfoOutlinedIcon style={styles.infoIcon} />
              </Tooltip>
            </div>

            <div style={styles.inputContainer}>
              <Dropdown
                style={styles.dropdown}
                floatingLabel={"VALIDATOR - title"}
                value={props.selectedValidator}
                onChange={value => props.storeSubProjectValidator(value)}
                id="assignee"
              >
                {getDropdownValidator(props.users)}
              </Dropdown>
              <IconButton
                data-test={"clear-validator"}
                onClick={() => props.storeSubProjectValidator("")}
                style={styles.deleteButton}
              >
                <CancelIcon color="action" />
              </IconButton>
            </div>

            {/* <div style={styles.validatorContainer}>
              <AssigneeSelection
                allowNoSelection={true}
                assigneeId={props.selectedValidator}
                users={props.users}
                title={"title"}
                assign={(id, name) => {
                  props.storeSubProjectValidator(id);
                }}
              />
            </div> */}
          </div>
        ) : null}
      </div>
      <Divider />
      <div>
        <Budget
          projectedBudgets={props.subprojectToAdd.projectedBudgets}
          deletedProjectedBudgets={props.subprojectToAdd.deletedProjectedBudgets}
          addProjectedBudget={props.addSubProjectProjectedBudget}
          editProjectedBudget={props.editSubProjectProjectedBudgetAmount}
          storeDeletedProjectedBudget={props.storeDeletedProjectedBudget}
          projectProjectedBudgets={props.projectProjectedBudgets}
        />
      </div>
    </div>
  );
};

export default SubprojectDialogContent;
