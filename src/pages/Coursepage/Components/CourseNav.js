// React spesifikt
import React, { useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

// 3rd-party Packages
import axios from 'axios';

// Studentreisen-assets og komponenter
import CourseList from './CourseList';
import ModuleList from './ModuleList';
import RelevantField from './RelevantField';
import CookieService from '../../../global/Services/CookieService';
import {tabCourse} from '../../../global/Services/Actions';

// Material UI komponenter 
import {Tabs, Tab, Typography, Button, TextField} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

// Komponent for tab, bestemmer hva som skal vises
// avhengig av en gitt verdi 
function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

// Styling for Material Design komponenter
const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    boxShadow: 'none',
    
  },

  buttonIcon: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    boxShadow: 'none',
    
  },

  search: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0),
  },
}));

// Starten av filkomponent
const CourseNav = (props) => {

  // Hook for å få tilgang på styling
  const classes = useStyles();

    useEffect(()=>{
      fetchData();
    },[]);
  
    // Hooks for å få tilgang på Redux funksjoner og definerer Tab-komponentens posisjon
    const getCoursePosition = useSelector(state => state.course_tab_position);
    const dispatch = useDispatch();
    const [position, setPosition] = useState(getCoursePosition);

    //States for søk
    const [input, setInput] = useState('');
    const [modulesDefault, setModulesDefault] = useState([]);
    const [coursesDefault, setCoursesDefault] = useState([]);

    // States for å legge inn innhentet data
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [fields, setFields] = useState([]);

    // Henter kursdata
    const fetchData = () => {
      const token = CookieService.get("authtoken");
                
      const data = {
            token: token
        }

      // Tre forkjellige API-kall mot server-side
      axios.all([
        axios.get(process.env.REACT_APP_APIURL + "/course/"),
        axios.get(process.env.REACT_APP_APIURL + "/course/module"),
        axios.post(process.env.REACT_APP_APIURL + "/profile/getInteresser", data)

      ]).then(axios.spread((res1, res2, res3) => {
        
        // Populerer states med innhentet data
        setCourses(res1.data);
        setCoursesDefault(res1.data);
        setModules(res2.data);
        setModulesDefault(res2.data);
        setFields(res3.data.results);
      }));
    };
   
    // States for pagination
    const [currentPage_c, setcurrentPage_c] = useState(1);
    const [postsPerPage_c, setPostsPerPage_c] = useState(12);

    const [currentPage_m, setcurrentPage_m] = useState(1);
    const [postsPerPage_m, setPostsPerPage_m] = useState(12);

    //PAGINATION: Få nåværende poster for kurs
    const cindexOfLastPost = currentPage_c * postsPerPage_c;
    const cindexOfFirstPost = cindexOfLastPost - postsPerPage_c;

    const currentPosts_c = courses.slice(cindexOfFirstPost, cindexOfLastPost);
    const numberOfPages_c = Math.ceil(courses.length / postsPerPage_c);
    const interval_c =  cindexOfFirstPost + currentPosts_c.length;

    //PAGINATION: Få nåværende poster for moduler
    const mindexOfLastPost = currentPage_m * postsPerPage_m;
    const mindexOfFirstPost = mindexOfLastPost - postsPerPage_m;

    const currentPosts_m = modules.slice(mindexOfFirstPost, mindexOfLastPost);
    const numberOfPages_m = Math.ceil(modules.length / postsPerPage_m);
    const interval_m =  mindexOfFirstPost + currentPosts_m.length;
    
    // Bytter verdien til tab-posisjon, og lagrer det i Redux states store
    const handleChange = (event, newValue) => {
      setPosition(newValue);
        if(newValue === 1) {
          dispatch(tabCourse(newValue));
        };
        if(newValue === 0) {
          dispatch(tabCourse(newValue));
        }; 
    };

    //PAGINATION: Håndterer bytte av sider
    const handlePageCourse = (event, value) => {
      setcurrentPage_c(value);
    };
    
    const handlePageModule = (event, value) => {
      setcurrentPage_m(value);
    };
    
    // Håndterer tekstfelt innskrivning
    const onInputChange = e => {
      setInput(e.target.value);
    }

    // Håndterer søkebar funksjonalitet
    const updateInput = async (e) => {
      e.preventDefault();

      // Søk for Kursdata
      if(position === 0) {
        const filtered = coursesDefault.filter(courses => {
          return courses.navn.toLowerCase().includes(input.toLowerCase())
        });
        setCourses(filtered);
      };
      // Søk for Kursmoduldata
      if(position === 1) {
        const filtered = modulesDefault.filter(modules => {
          return modules.navn.toLowerCase().includes(input.toLowerCase())
        });
        setModules(filtered);
      };
     
   };


    return (
        <div> 
            {/* Søkebar og Nytt kurs knapp */}
            <div className="course-header-section">
              <div className="search-wrap">
                  <form className="searchBox" onSubmit={updateInput} >    
                      <TextField value={input} className={classes.search} size="small" onChange={onInputChange} label="Søkefelt" type="search" variant="outlined"/>                           
                      <Button type="submit" className={classes.button} size="small" variant="contained" endIcon={<SearchIcon />}>Søk</Button>
                  </form>
                <div className="wrapNewcourse">
                  {props.type === 3 || props.type === 4 && position == 0 &&
                    <Button className={classes.buttonIcon} href="/course/new" variant="contained" color="primary">Nytt kurs <AddIcon/></Button>
                  }
                </div>
            </div>       
          </div>

            {/* Tab */}
            <div className="BorderBox"> 
              <Tabs className="tab" value={position} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                  <Tab className="tabKurs" label="Kurs" />
                  <Tab className="tabKursmodul" label="Kursmodul" />
              </Tabs>
            </div>
            
            {/* Overskrifter */}
            <div className="NavHeaderWrap">
              { position == 0 &&
                <h1 className="NavHeader">Alle kurs</h1>
              }
              { position == 1 &&
                <h1 className="NavHeader">Kursmodul</h1>
              }
            </div>
              
            {/*  Tab posisjon for kursliste og Relevantkursliste */}
            {Object.entries(courses).length !== 0 &&
            <TabPanel value={position} index={0}>
                <div className="content-overview">
                    <div className="indexRes">
                      <Typography variant="caption">Viser {cindexOfFirstPost + 1} - {interval_c} av {courses.length} treff</Typography>
                    </div>
                    <div className="wrap-list">
                      <div className="wrapIndexPage">
                        <CourseList courses={currentPosts_c}/>
                          <div className="indexPagination">
                            <div className="indexRes2">
                              <div className="indexCenterWrap">
                                <Typography  variant="caption" >Viser {cindexOfFirstPost + 1} - {interval_c} av {courses.length} treff</Typography>
                              </div>
                              <div className="indexCenterWrap">
                                <Pagination count={numberOfPages_c} page={currentPage_c} onChange={handlePageCourse} />
                              </div>
                            </div>
                          </div>
                      </div>
                      <RelevantField fields={fields}/>
                    </div>

                </div>
            </TabPanel>
            }

            {/*  Tab posisjon for kursmodul */}
            {Object.entries(modules).length !== 0 &&
            <TabPanel value={position} index={1}>
                <div className="content-main">
                  <div className="wrapIndexModulePage">
                    <div className="indexRes">
                      <Typography variant="caption">Viser {mindexOfFirstPost + 1} - {interval_m} av {modules.length} treff</Typography>
                    </div>
                    <ModuleList modules={currentPosts_m}/>
                    <div className="indexPaginationM">
                      <div className="indexRes2">
                        <div className="indexCenterWrap">
                          <Typography  variant="caption" >Viser {mindexOfFirstPost + 1} - {interval_m} av {modules.length} treff</Typography>
                        </div>
                        <div className="indexCenterWrap">
                          <Pagination count={numberOfPages_m} page={currentPage_m} onChange={handlePageModule} />
                        </div>  
                      </div>
                    </div>
                  </div>
                </div>               
            </TabPanel>   
            }
        </div>    
    );
};


export default CourseNav;