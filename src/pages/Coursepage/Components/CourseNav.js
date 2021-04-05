import React, { useState, useContext} from 'react';
import CourseList from './CourseList';
import ModuleList from './ModuleList';
import { CourseContext, ModuleContext } from './CourseContext';
import Pagination from '@material-ui/lab/Pagination';


import {Tabs, Tab, Typography} from '@material-ui/core';


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

const CourseNav = () => {

    const [position, setPosition] = useState(0);

    // States for pagination
    const [courses, setCourses] = useContext(CourseContext);
    const [modules, setModules] = useContext(ModuleContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);

    //Få nåværende poster
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts_c = courses.slice(indexOfFirstPost, indexOfLastPost);
    const numberOfPages_c = Math.ceil(courses.length / postsPerPage);
    const interval_c =  indexOfFirstPost + currentPosts_c.length;

    const currentPosts_m = modules.slice(indexOfFirstPost, indexOfLastPost);
    const numberOfPages_m = Math.ceil(modules.length / postsPerPage);
    const interval_m =  indexOfFirstPost + currentPosts_m.length;
    
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    const handlePage = (event, value) => {
      setCurrentPage(value);
    };


    return (
        <div>  
            <div className="BorderBox"> 
              <Tabs className="tab" value={position} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                  <Tab className="tabKurs" label="Kurs" />
                  <Tab className="tabKursmodul" label="Kursmodul" />
              </Tabs>
            </div>

            <TabPanel value={position} index={0}>
                <div className="content-overview">
                  <div className="indexRes">
                    <Typography variant="caption">Viser {indexOfFirstPost + 1} - {interval_c} av {courses.length} treff</Typography>
                  </div>
                  <CourseList courses={currentPosts_c}/>
                </div>
                  <div className="wrapIndexPage">
                    <div className="indexPosition">
                      <div className="indexPagination">
                        <div className="indexRes2">
                          <div className="indexCenterWrap">
                            <Typography  variant="caption" >Viser {indexOfFirstPost + 1} - {interval_c} av {courses.length} treff</Typography>
                          </div>
                          <div className="indexCenterWrap">
                            <Pagination count={numberOfPages_c} page={currentPage} onChange={handlePage} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
            </TabPanel>
            
            <TabPanel value={position} index={1}>
                <div className="content-main">
                  <div className="indexRes">
                    <Typography variant="caption">Viser {indexOfFirstPost + 1} - {interval_m} av {modules.length} treff</Typography>
                  </div>
                  <ModuleList modules={currentPosts_m}/>
                </div>
                <div className="wrapIndexPage">
                    <div className="indexPosition">
                      <div className="indexPaginationM">
                        <div className="indexRes2">
                          <div className="indexCenterWrap">
                            <Typography  variant="caption" >Viser {indexOfFirstPost + 1} - {interval_m} av {modules.length} treff</Typography>
                          </div>
                          <div className="indexCenterWrap">
                            <Pagination count={numberOfPages_m} page={currentPage} onChange={handlePage} />
                          </div>  
                        </div>
                      </div>
                    </div>
                  </div>
            </TabPanel>   
        </div>

    );
};


export default CourseNav;