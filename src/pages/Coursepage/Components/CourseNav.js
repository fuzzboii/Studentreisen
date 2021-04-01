import React, { useState, useContext} from 'react';
import CourseList from './CourseList';
import ModuleList from './ModuleList';
import { CourseContext } from './CourseContext';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);

    //Få nåværende poster
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = courses.slice(indexOfFirstPost, indexOfLastPost);
    const numberOfPages = Math.ceil(courses.length / postsPerPage);
    const interval =  indexOfFirstPost + currentPosts.length;
    
      
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
                    <Typography variant="caption">Viser {indexOfFirstPost + 1} - {interval} av {courses.length} treff</Typography>
                  </div>
                  <CourseList courses={currentPosts}/>
                </div>
                  <div className="wrapIndexPage">
                    <div className="indexPosition">
                      <div className="indexPagination">
                        <div className="indexRes2">
                          <Typography  variant="caption" >Viser {indexOfFirstPost + 1} - {interval} av {courses.length} treff</Typography>
                        </div>
                        <Pagination count={numberOfPages} page={currentPage} onChange={handlePage} />
                      </div>
                    </div>
                  </div>
            </TabPanel>
            
            <TabPanel value={position} index={1}>
              <div className="content-main">
                <ModuleList/>
              </div>
            </TabPanel>   
        </div>

    );
};


export default CourseNav;