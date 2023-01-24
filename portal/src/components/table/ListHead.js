import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Box, Checkbox, TableRow, TableHead, TableSortLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';


// ----------------------------------------------------------------------

ListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
  expandable: PropTypes.bool
};

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#DFE3E8",
      color: "#212B36",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));


export default function ListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  expandable,
  multi
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
        <TableRow>
            {
                (multi || multi==null) && (
                    <StyledTableCell padding="checkbox" size="small">
                        <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        />
                    </StyledTableCell>
                )
            }
            

            {
                (expandable || expandable==null) && (
                    <StyledTableCell />
                )
            }
            
            
            {headLabel.map((headCell) => (
            <StyledTableCell
                key={headCell.id}
                align={headCell.alignRight ? 'right' : 'left'}
                sortDirection={orderBy === headCell.id ? order : false}
                size="small"
            >
                <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                >
                {headCell.label}
                {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            </StyledTableCell>
            ))}
        </TableRow>
    </TableHead>
  );
}
