import React, { useRef , useState}  from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import './news-carousel.scss'
import { Card } from "react-bootstrap";
import Moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function NewsCarousels({data, headerName}) {
  SwiperCore.use([Autoplay])
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const swiperRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const noDataCss={
    'text-align':'center'
  }
  const loader_image =
  'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/loader.gif';
  const setLoading = ()=>{
    setLoaded(true);
  }
  return (
    <React.Fragment>
      <div className="big-cards-container">
        <div className="slider-container-title">
            <h5>
              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-news.svg" alt="cazi-news"></img>
              <span className="header-sp">{headerName}</span>
            </h5>
          </div>
        {

          data.length > 0 ?
            <Swiper
              ref={swiperRef}
              spaceBetween={10}
              // slidesPerView={3}
              slidesPerGroup={1}
              // navigation
              observer = {true}
              observeParents= {true}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              onSwiper={(swiper) => {
                if(swiper && swiper.params){
                setTimeout(() => {
                  swiper.params.navigation.prevEl = navigationPrevRef.current
                  swiper.params.navigation.nextEl = navigationNextRef.current
                  swiper.navigation.destroy()
                  swiper.navigation.init()
                  swiper.navigation.update()
                })}
              }}
              breakpoints={{
                500: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1500: {
                  slidesPerView: 3,
                }
              }}>
              <div ref={navigationPrevRef} className="previous-custom" id="prev-custom-arrow">
              </div>
              <div ref={navigationNextRef} className="next-custom" id="next-custom-arrow">
              </div>
              {
                data.map((item, i) => {
                  let dateTime = item.pubDate;
                  let dateTimeArr = dateTime.split(' ');
                  let nDate =  Moment(dateTimeArr['0']).format('DD/MM/YYYY');
                  let nTime = dateTimeArr['1'];
                  let newsTitle = item.title.replace('land', 'Land'); 
                  let newsDesc = item.description.replace(/<h3>(.*?)<\/h3>/, '').replace(/(<([^>]+)>)/ig, ''); 
                  return (
                    <SwiperSlide key={i} className="news-carousel">
                      <Card style={{padding: "20px"}}>
                        <a href={item.link} target="_blank" rel="noreferrer"> 
                        <LazyLoadImage
                              onLoad={setLoading}
                              style={{ width: '100%' }}
                              className="news-carousel-image"
                              src={loaded === false ? loader_image : item.thumbnail}
                          />
                        {/* <Card.Img className="news-carousel-image"  variant="top" src={item.thumbnail} /> */}
                        </a>
                        
                          <Card.Body>
                            <Card.Title as="h5" className="text-overflow">{newsTitle}</Card.Title>
                              <Card.Text className="mb-0">{newsDesc}</Card.Text>
                          </Card.Body>
                        <Card.Footer className="pt-0" style={{border: "none"}}>
                          <small className="footer-text">Last update on: {nDate} at {nTime}</small>
                        </Card.Footer>
                      </Card>
                    </SwiperSlide>
                  );
                })
              }
            </Swiper>
          : 
          <p style={noDataCss}>No Data</p>
        }
      </div>
    </React.Fragment>
  );
};
