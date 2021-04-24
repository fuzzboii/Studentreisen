import React, { useState, useEffect} from 'react';
import CourseList from './CourseList';
import ModuleList from './ModuleList';
import RelevantField from './RelevantField';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import CookieService from '../../../global/Services/CookieService';
import {Tabs, Tab, Typography, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { AddOutlined } from '@material-ui/icons';


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

const CourseNav = (props) => {

  const useStyles = makeStyles((theme) => ({
    button: {
      position: "absolute",
      padding: 0,
      marginLeft: theme.spacing(2),
      width: theme.spacing(12),
    },
  }));

  const classes = useStyles();

    useEffect(()=>{
      fetchData();
    },[]);
  

    const [position, setPosition] = useState(0);

    // States for pagination
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [fields, setFields] = useState([]);
    const set = false;
    var array3 = [];

    const fetchData = () => {
      const token = CookieService.get("authtoken");
                
        const data = {
            token: token
        }

      axios.all([
        axios.get(process.env.REACT_APP_APIURL + "/course/"),
        axios.get(process.env.REACT_APP_APIURL + "/course/module"),
        axios.post(process.env.REACT_APP_APIURL + "/profile/getInteresser", data)

      ]).then(axios.spread((res1, res2, res3) => {
        setCourses(res1.data);
        setModules(res2.data);
        setFields(res3.data.results);
        console.log("interesser", res3.data.results);

        func();
       
      }));
    };
   
    const func = () => {
      if(fields !== undefined) {
        fields.forEach( intr  => {
          courses.forEach( course => {
            if(intr.beskrivelse === course.felt) {
                array3 = [...array3, course];
            };
          });
        });
        console.log("nycourse", array3);

      }
    };
    

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
    
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    const handlePageCourse = (event, value) => {
      setcurrentPage_c(value);
    };
    
    const handlePageModule = (event, value) => {
      setcurrentPage_m(value);
    };


    return (
        <div>  
            <div className="BorderBox"> 
              <Tabs className="tab" value={position} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                  <Tab className="tabKurs" label="Kurs" />
                  <Tab className="tabKursmodul" label="Kursmodul" />
              </Tabs>
            </div>

            {Object.entries(courses).length !== 0 &&
            <TabPanel value={position} index={0}>
                <div className="content-overview">
                  <div className="indexRes">
                    <Typography variant="caption">Viser {cindexOfFirstPost + 1} - {interval_c} av {courses.length} treff</Typography>
                    {props.type === 3 || props.type === 4 &&
                      <Button href="/course/ny" className={classes.button} variant="contained" color="primary">Nytt kurs</Button>
                    }
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
            {Object.entries(modules).length !== 0 &&
            <TabPanel value={position} index={1}>
                <div className="content-main">
                  <div className="wrapIndexPage">
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