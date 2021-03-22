// React-spesifikt
import React from "react";

// 3rd-party Packages
import { useTable, usePagination } from 'react-table'
import { FirstPage, LastPage, NavigateNext, NavigateBefore } from '@material-ui/icons';
import { Select, MenuItem, Input, Button } from '@material-ui/core';

// Studentreisen-assets og komponenter
import '../CSS/UserOverview.css';
import axios from "axios";
import CookieService from '../../../global/Services/CookieService';


function PrefetchData() {
    const token = {
        token: CookieService.get("authtoken")
    }
    // Axios POST request
    axios
        // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
        // Axios serialiserer objektet til JSON selv
        .post(process.env.REACT_APP_APIURL + "/tools/getAllUserData", token)
        // Utføres ved mottatt resultat
        .then(res => {
            if(res.data.results) {
                allData = res.data.results;
                allDataFetched = true;
            }
        });
        

    return (
        <UserOverview/>
    )
}

let allData;
let allDataFetched = false;

function UserOverview() {
    const [data, setData] = React.useState([]);
    const [fetching, setFetching] = React.useState(false);
    const [pageAmount, setPageAmount] = React.useState(0);
    const fetchIDReference = React.useRef(0);

    const columns = React.useMemo(() => 
        [
            {
                Header: "ID",
                columns: [
                    {
                        Header: "#",
                        accessor: "brukerid"
                    }
                ]
            },
            {
                Header: "Brukerinfo",
                columns: [
                    {
                        Header: "Fornavn",
                        accessor: "fnavn"
                    },
                    {
                        Header: "Etternavn",
                        accessor: "enavn"
                    }
                ]
            },
            {
                Header: "Ekstra info",
                columns: [
                    {
                        Header: "Telefon",
                        accessor: "telefon"
                    },
                    {
                        Header: "E-post",
                        accessor: "email"
                    }
                ]
            }
        ], []
    );

    const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
        const fetchID = ++fetchIDReference.current;

        setFetching(true);
        
        const continueFetchingData = () => {
            if(fetchID === fetchIDReference.current ) {
                const startRow = pageSize * pageIndex;
                const endRow = startRow + pageSize;
    
                setData(allData.slice(startRow, endRow));
    
                setPageAmount(Math.ceil(allData.length / pageSize));
    
                setFetching(false);
            }
        }

        const checkAllData = () => {
            if(allDataFetched) {
                continueFetchingData();
            } else { 
                setTimeout(checkAllData, 50);
            }
        }

        checkAllData();
    }, []);

    return (
        <TableOverview
            columns={columns}
            data={data}
            fetchData={fetchData}
            fetching={fetching}
            pageAmount={pageAmount}
        />
    )
}

//Flytte i en fil? 
function TableOverview({ columns, data, fetchData, fetching, pageAmount: controlledPageCount }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({columns, data, initialState: { pageIndex: 0, hiddenColumns : ["telefon", "email"] }, manualPagination: true, pageCount: controlledPageCount},
        usePagination);
    
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize]);

    return (
        <>
        <section id="section_useroverview">
            <h1>Brukeroversikt</h1>
            <table {...getTableProps()} id="table_useroverview">
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                        <span>
                            {column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}
                        </span>
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })}
                <tr>
                    {fetching ? (<td colSpan="10000">Laster...</td>) : (<></>)}
                </tr>
                </tbody>
            </table>
            <div id="table_pagination_useroverview">
                <section id="table_pagination_left_useroverview">
                    <Button variant="contained" onClick={() => gotoPage(0)} disabled={!canPreviousPage}><FirstPage/></Button>
                    <Button variant="contained" onClick={() => previousPage()} disabled={!canPreviousPage}><NavigateBefore/></Button>
                    <Button variant="contained" onClick={() => nextPage()} disabled={!canNextPage}><NavigateNext/></Button>
                    <Button variant="contained" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><LastPage/></Button>
                    <p>Side {pageIndex + 1} av {pageOptions.length}</p>
                </section> 
                <section id="table_pagination_right_useroverview">
                    <Input id="table_pagination_right_input_useroverview" type="number" defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                    />
                    <Select value={pageSize} 
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}>
                        <MenuItem value="10">Vis 10</MenuItem>
                        <MenuItem value="20">Vis 20</MenuItem>
                        <MenuItem value="30">Vis 30</MenuItem>
                        <MenuItem value="40">Vis 40</MenuItem>
                        <MenuItem value="50">Vis 50</MenuItem>
                    </Select>
                </section>
            </div>
        </section>
        </>
    );
};

export default PrefetchData;