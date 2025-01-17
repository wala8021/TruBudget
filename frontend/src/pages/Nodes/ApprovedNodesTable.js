import React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import strings from "../../localizeStrings";
import ApprovedNodestableEntry from "./ApprovedNodestableEntry";

const groupBy = nodes => {
  return nodes.reduce((acc, node) => {
    if (node.currentAccess.accessType !== "none") {
      const key = node.address.organization;
      const index = acc.findIndex(x => x.organization === key);
      if (index === -1) {
        acc.push({ organization: key, count: 1, permissions: node.currentAccess.accessType });
      } else {
        acc[index].count += 1;
        acc[index].permissions = acc[index].permissions.concat(`, ${node.currentAccess.accessType}`);
      }
    }
    return acc;
  }, []);
};

const ApprovedNodesTable = props => {
  const { nodes } = props;
  const groupedNodes = groupBy(nodes);

  return (
    <Paper data-test="approved-nodes-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{strings.common.organization}</TableCell>
            <TableCell>{strings.nodesDashboard.nodes}</TableCell>
            <TableCell>{strings.nodesDashboard.access}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-test="approved-nodes-table-body">
          {groupedNodes.map(nodeGroup => {
            return <ApprovedNodestableEntry key={nodeGroup.organization} nodeGroup={nodeGroup} nodes={nodes} />;
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ApprovedNodesTable;
