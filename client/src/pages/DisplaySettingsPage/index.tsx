import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
} from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

import useSelectedTabLink from '../../hooks/useSelectedTabLink';

export default function DisplaySettingsPage() {
  const { tabIndex } = useSelectedTabLink([
    ['/display-settings', '/display-settings/update'],
    '/display-settings/showed',
  ]);

  return (
    <Container maxW="container.xl">
      <Tabs isFitted index={tabIndex}>
        <TabList>
          <Tab as={Link} to="/display-settings/update">
            Update schedule
          </Tab>
          <Tab as={Link} to="/display-settings/showed">
            Showed subjects
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Outlet />
          </TabPanel>
          <TabPanel>
            <Outlet />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
