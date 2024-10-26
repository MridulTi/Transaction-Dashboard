import { Card, Input, List, ListItem, Option, Select, Typography } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import DefaultPagination from '../Components/Pagination';
import { BarChart } from '../Components/Charts';

function Home() {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [month, setMonth] = useState(2);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [allResult, setAllResult] = useState({});
  const [chartData, setChartData] = useState({
    Bar: { labels: [], datasets: [] },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const TABLE_HEAD = ['Title', 'Description', 'Category', 'Price', 'Sold', 'Image'];

  function handleSearchInput(e) {
    setSearch(e.target.value);
  }

  function handleMonth(e) {
    setMonth(e);
    setSearch("");
    axios.get(`/api/v1/product/all_transactions/${e+1}`)
      .then(res => setSearchResult(res.data.data.transactions))
      .catch(err => console.log(err));
  }

  function handleSearch() {
    axios.get(`/api/v1/product/all_transactions/${month+1}?q=${search}&page=${currentPage}`)
      .then(res => {
        setSearchResult(res.data.data.transactions);
        setTotalPages(Math.ceil(res.data.data.totalCount / 10));
      })
      .catch(err => {
        console.log(err);
        setSearchResult([])
        setTotalPages(0)
    });
  }

  useEffect(() => {
    if (search.length === 0) {
      axios.get(`/api/v1/product/all_transactions/${month+1}`)
        .then(res => {
          setSearchResult(res.data.data.transactions);
          setTotalPages(Math.ceil(res.data.data.totalCount / 10));
        })
        .catch(err => console.log(err));
    }
  }, [search]);

  useEffect(() => {
    setChartData({ Bar: { labels: [], datasets: [] } });
    axios.get(`/api/v1/product/combinedResponse/${month+1}`)
      .then(res => {
        setAllResult(res.data.data);
        setChartData({
          Bar: {
            labels: res.data.data?.priceRange.map(data => data.range),
            datasets: [{
              label: "Price Range Count",
              backgroundColor: "cyan",
              data: res.data.data?.priceRange.map(data => data.count)
            }]
          }
        });
      })
      .catch(err => console.log(err));
  }, [month]);

  return (
    <div className='py-6 px-4 sm:px-8 md:px-12 lg:px-16 min-h-screen flex flex-col gap-6 place-items-center'>
      <h1 className='grid place-items-center text-3xl sm:text-4xl md:text-5xl font-bold text-center'>Transaction Dashboard</h1>

      <div className='grid gap-4 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 w-full max-w-5xl'>
        <Input color="blue" label="Search transaction" value={search} onChange={handleSearchInput} icon={<CiSearch onClick={handleSearch} className="text-white cursor-pointer text-2xl p-0.5 bg-blue-600 rounded-md" />} />
        <Select label="Select Month" defaultValue="MARCH" onChange={handleMonth}>
          {months.map((data, index) => (
            <Option key={index} value={index}>{data}</Option>
          ))}
        </Select>
      </div>

      <div className='w-full max-w-7xl'>
        {searchResult.length !== 0 ? (
          <div className='grid place-items-center gap-6'>
            <Card className="max-h-[72vh] w-full overflow-y-scroll">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searchResult?.map(({ title, description, category, price, sold, image }, index) => (
                    <tr key={index} className="even:bg-blue-gray-50/50">
                      <td className="p-2 text-pretty w-64">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {title}
                        </Typography>
                      </td>
                      <td className="p-4 text-pretty w-96">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {description}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {category}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold text-green-600">
                          ₹{price}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {sold ? "YES" : "NO"}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <img src={image} className='aspect-square w-20 h-20 sm:w-24 sm:h-24' />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <DefaultPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        ) : (
          <p className='text-gray-400 text-center'>No Result Found</p>
        )}
      </div>

      <Card className="w-full max-w-5xl p-5">
        <h1 className='font-bold text-lg sm:text-xl md:text-2xl'>Statistics - {months[month]}</h1>
        {Object.keys(allResult).length !== 0 && allResult?.statistics.length !== 0 ? (
          <List>
            <ListItem className='flex justify-between'>
              <h1 className='font-semibold'>Total Sales</h1>
              <p>{allResult?.statistics?.totalSale}</p>
            </ListItem>
            <ListItem className='flex justify-between'>
              <h1 className='font-semibold'>Total Sold Items</h1>
              <p>{allResult?.statistics?.totalItemsSold}</p>
            </ListItem>
            <ListItem className='flex justify-between'>
              <h1 className='font-semibold'>Total Not Sold Items</h1>
              <p>{allResult?.statistics?.totalNotSoldItems}</p>
            </ListItem>
          </List>
        ) : (
          <p className='text-gray-400 text-center'>No Result Found</p>
        )}
      </Card>

      <Card className="w-full max-w-5xl p-5">
        <h1 className='font-bold text-lg sm:text-xl md:text-2xl'>Bar Chart Stats - {months[month]}</h1>
        {chartData.Bar.datasets.length !== 0 ? (
          <BarChart chartData={chartData.Bar} />
        ) : (
          <p className='text-gray-400 text-center'>Loading...</p>
        )}
      </Card>
    </div>
  );
}

export default Home;
