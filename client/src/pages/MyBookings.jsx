// import React, { useEffect, useState } from 'react'
// import { dummyBookingData } from '../assets/assets'
// import Loading from '../components/Loading'
// import BlurCircle from '../components/BlurCircle'
// import timeFormat from '../lib/timeFormat'
// import { dateFormat } from '../lib/dateFormat'
// import { useAppContext } from '../context/AppContext'
// import { Link } from 'react-router-dom'

// const MyBookings = () => {
//   const currency = import.meta.env.VITE_CURRENCY

//   const { axios, getToken, user, image_base_url} = useAppContext()

//   const [bookings, setBookings] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   const getMyBookings = async () =>{
//     try {
//       const {data} = await axios.get('/api/user/bookings', {
//         headers: { Authorization: `Bearer ${await getToken()}` }
//       })
//         if (data.success) {
//           setBookings(data.bookings)
//         }

//     } catch (error) {
//       console.log(error)
//     }
//     setIsLoading(false)
//   }

//   useEffect(()=>{
//     if(user){
//       getMyBookings()
//     }
    
//   },[user])


//   return !isLoading ? (
//     <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
//       <BlurCircle top="100px" left="100px"/>
//       <div>
//         <BlurCircle bottom="0px" left="600px"/>
//       </div>
//       <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

//       {bookings
//       .filter(item => item.show && item.show.movie && item.show.movie.poster_path) // AiCode
//       .map((item,index)=>(
//         <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
//           <div className='flex flex-col md:flex-row'>
//             <img src={image_base_url + item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
//             <div className='flex flex-col p-4'>
//               <p className='text-lg font-semibold'>{item.show.movie.title}</p>
//               <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
//               <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
//             </div>
//           </div>

//           <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
//             <div className='flex items-center gap-4'>
//               <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
//               {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</Link>}
//             </div>
//             <div className='text-sm'>
//               <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
//               <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
//             </div>
//           </div>

//         </div>
//       ))}

//     </div>
//   ) : <Loading />
// }

// export default MyBookings


// Ai code 
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link, useLocation } from 'react-router-dom'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, user, image_base_url } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  // Fetch bookings from API
  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  // Fetch bookings on mount, when user changes, or when route/search changes
  useEffect(() => {
    if (user) {
      setIsLoading(true)
      getMyBookings()
    }
    // eslint-disable-next-line
  }, [user, location.search, location.pathname])

  // Also fetch bookings when window regains focus (after returning from Stripe)
  useEffect(() => {
    const onFocus = () => {
      if (user) {
        setIsLoading(true)
        getMyBookings()
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
    // eslint-disable-next-line
  }, [user, location.search, location.pathname]);

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.length === 0 && (
        <div className='flex flex-col items-center justify-center h-60'>
          <h2 className='text-2xl font-bold text-center'>No bookings found.</h2>
        </div>
      )}

      {bookings
        .filter(item => item?.show?.movie?.poster_path) // Only render valid bookings
        .map((item, index) => (
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
            <div className='flex flex-col md:flex-row'>
              <img
                src={image_base_url + item.show.movie.poster_path}
                alt={item.show.movie.title || ""}
                className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
              />
              <div className='flex flex-col p-4'>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>{item.show.movie.runtime ? timeFormat(item.show.movie.runtime) : "N/A"}</p>
                <p className='text-gray-400 text-sm mt-auto'>{item.show.showDateTime ? dateFormat(item.show.showDateTime) : "N/A"}</p>
              </div>
            </div>

            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                {!item.isPaid && item.paymentLink && (
                  <Link
                    to={item.paymentLink}
                    className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'
                  >
                    Pay Now
                  </Link>
                )}
                {item.isPaid && (
                  <span className='text-green-500 font-semibold mb-3'>Paid</span>
                )}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats?.length || 0}</p>
                <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats?.join(", ") || "N/A"}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  ) : <Loading />
}

export default MyBookings
