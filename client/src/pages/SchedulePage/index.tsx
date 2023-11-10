import {
  Table,
  TableCellProps,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';

export default function SchedulePage() {
  const propsCell: TableCellProps = {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: useColorModeValue('blackAlpha.300', 'gray.700'),
  };

  const propsFirstColumn: TableCellProps = {
    ...propsCell,
    px: 2,
    backgroundColor: useColorModeValue('yellow.100', 'green.600'),
  };

  const propsTh: TableCellProps = {
    ...propsCell,
    width: 'calc(100% / 5)',
    color: 'white',
    backgroundColor: useColorModeValue('orange.500', 'blue.600'),
  };

  const propsActiveTdColumn: TableCellProps = {
    ...propsCell,
    backgroundColor: useColorModeValue('purple.100', 'purple.700'),
  };

  const propsActiveThColumn: TableCellProps = {
    ...propsTh,
    backgroundColor: useColorModeValue('orange.600', 'blue.700'),
  };

  return (
    <TableContainer w="100%" py={3}>
      <Table maxW={2048} margin="0 auto">
        <Thead>
          <Tr>
            <Th {...propsFirstColumn}></Th>
            <Th {...propsTh}>Monday</Th>
            <Th {...propsActiveThColumn}>Tuesday</Th>
            <Th {...propsTh}>Wednesday</Th>
            <Th {...propsTh}>Thursday</Th>
            <Th {...propsTh}>Friday</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td {...propsFirstColumn}>8:30-9:50</Td>
            <Td {...propsCell}></Td>
            <Td {...propsActiveTdColumn}>Math</Td>
            <Td {...propsCell}>English</Td>
            <Td {...propsCell}></Td>
            <Td {...propsCell}></Td>
          </Tr>
          <Tr>
            <Td {...propsFirstColumn}>10:00-11:20</Td>
            <Td {...propsCell}>Biology</Td>
            <Td {...propsActiveTdColumn}></Td>
            <Td {...propsCell}></Td>
            <Td {...propsCell}></Td>
            <Td {...propsCell}></Td>
          </Tr>
          <Tr>
            <Td {...propsFirstColumn}>11:40-13:00</Td>
            <Td {...propsCell}></Td>
            <Td {...propsActiveTdColumn}>History</Td>
            <Td {...propsCell}></Td>
            <Td {...propsCell}></Td>
            <Td {...propsCell}></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
