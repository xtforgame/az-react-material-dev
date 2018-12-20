/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

export default class EnhancedTableHead extends React.Component {
  createSortHandler = property => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      withDetail,
      withActions,
      columns,
      columnSizes,
      order,
      orderBy,
      sortTip,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {withDetail && (
            <TableCell
              padding="checkbox"
              style={columnSizes ? { width: 72 } : {}}
            />
          )}
          {columns.map((column, i) => {
            const sortProps = {};
            const style = (columnSizes && columnSizes[i] != null) ? { width: columnSizes[i] } : {};
            let { label } = column;
            if (column.sortable !== false) {
              sortProps.sortDirection = orderBy === column.id ? order : false;
              label = (
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              );
            }

            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.padding || 'default'}
                className={column.cellClassName}
                {...sortProps}
                style={style}
              >
                {column.label && (
                  <Tooltip
                    title={sortTip}
                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    {label}
                  </Tooltip>
                )}
              </TableCell>
            );
          }, this)}
          {withActions && <TableCell padding="checkbox" style={columnSizes ? { width: 72 } : {}} />}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  columns: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};
