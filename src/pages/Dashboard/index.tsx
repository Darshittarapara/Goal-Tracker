import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { Strings } from 'config/Strings';
import { useDashboardContext } from 'context/Dashboard/DashboardContext';
import { Row, Col } from 'react-bootstrap';
import { LinearProgress } from '@mui/material';
import { useGoalContext } from 'context/GoalContext/GoalContext';
import Loader from 'components/Loader';
import AnalysisItem from 'pages/DailyProcess/components/AnalysisItem';
import MaterialUISelectInput from 'components/MaterialUISelectInput/MaterialUISelectInput';
import { FilterOption } from 'pages/Goals/List';
// import { mainListItems, secondaryListItems } from './listItems';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const { goalsProcessList } = useDashboardContext()
  const { isLoading, goals, onFilter, filterAttribute, resetFilterState } = useGoalContext()
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    return () => {
      resetFilterState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const totalGoals = goals.length;
  const goalWithHighPriority = goals.filter((item) => item.priority === "high")?.length;
  const goalWithMediumPriority = goals.filter((item) => item.priority === "medium")?.length;
  const goalWithLowPriority = goals.filter((item) => item.priority === "low")?.length

  const goalHistory = [
    {
      value: totalGoals,
      label: Strings.totalGoals
    },
    {
      value: goalWithHighPriority,
      label: Strings.highPriorityGoals
    },
    {
      value: goalWithMediumPriority,
      label: Strings.mediumPriorityGoals
    },
    {
      value: goalWithLowPriority,
      label: Strings.lowPriorityGoals
    },
  ]



  return (
    <ThemeProvider theme={defaultTheme}>
      {isLoading ? <Loader /> : (

        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {/* <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar> */}
          {/* <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        > */}
          <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Typography component="h1" variant='h4' sx={{ marginBottom: "20px" }}>{Strings.dashboard}</Typography>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: "auto",
                  }}
                >
                  <div className='section-header p-0'>
                    <Typography component="h4" variant="h5" color="dark" gutterBottom>
                      {Strings.goalsProcess}
                    </Typography>
                    <MaterialUISelectInput
                      updateFieldKey={Strings.priority.toLocaleLowerCase()} label={Strings.priority} options={FilterOption} value={filterAttribute.priority} onChange={onFilter} />
                  </div>
                  {goalsProcessList?.length > 0 ? (
                    goalsProcessList.map((item) => {
                      const progressbarColor = item.value < 50 ? "error" : item.value >= 50 && item.value < 100 ? "primary" : "success"
                      return (
                        <Row className="mb-2">
                          <Col>
                            <Typography component="h2" variant="h6">{item.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" color={progressbarColor} value={item.value} />
                              </Box>
                              <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">{`${Math.round(
                                  item.value,
                                )}%`}</Typography>
                              </Box>
                            </Box>
                          </Col>
                        </Row>
                      )
                    })
                  ) : <h4>No found</h4>}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Typography component="h4" variant="h5" color="dark" gutterBottom>
                    {Strings.goalHistory}
                  </Typography>
                  {goalHistory.map((item, index) => {
                    return <AnalysisItem value={item.value} label={item.label} key={`${index}`} />
                  })}
                </Paper>
              </Grid>
              {/* Recent Orders */}
              {/* <Grid item xs={12}>
              
              </Grid> */}
            </Grid>
          </Container>
        </Box>
      )}
      {/* </Box> */}
    </ThemeProvider>
  );
}
