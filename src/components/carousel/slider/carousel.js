import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import './carousel.scss';
import'react-placeholder/lib/reactPlaceholder.css'
import ReactPlaceholder from 'react-placeholder';
import { useHistory } from 'react-router-dom';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';
import { Card } from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const loader_image =
  'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/loader.gif';

const windowWidth = window.innerWidth;
const awesomePlaceholder = (
  windowWidth > 499 ?
  <div style={{ width: '100%',height: '200px',display: 'flex',backgroundColor: 'white',}}>
    <div style={{width: '18%',marginRight: '25px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={6} color="gainsboro" />
    </div>
    <div style={{width: '18%',marginRight: '25px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={6} color="gainsboro" />
    </div>
    <div style={{width: '18%',marginRight: '25px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={6} color="gainsboro" />
    </div>
    <div style={{width: '18%',marginRight: '25px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={6} color="gainsboro" />
    </div>
    <div style={{width: '18%',marginRight: '25px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={6} color="gainsboro" />
    </div>
  </div>:<div style={{ width: '100%',height: '200px',display: 'flex',backgroundColor: 'white',}}>
    <div style={{ width: '100%',marginRight: '0',height: '100%',backgroundColor: 'gainsboro'}}>
        <RectShape color="gainsboro" />
        <TextBlock rows={6} color="gainsboro" />
    </div>
</div>
);

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function Carousel({
  data,
  title,
  headerName,
  loading,
  timing,
}) {
  SwiperCore.use([Autoplay]);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const swiperRef = useRef(null);
  const GamesToHide = ['BlackJack Lucky Sevens', 'Totem Towers', 'SAGAMING'];
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const setLoading = ()=>{
    setLoaded(true);
  }

  const goToGameDetails = (item) => {
    history.push(
      {pathname : `/game-detail/${item.id}`,
      state : item},
      
    );
  };
  //in your component

  //show default image
  const addDefaultSrc = (ev, i, title) => {
    ev.target.src = loader_image;
    let elements = document.getElementsByClassName('image-outer-div-' + i + '-' + title);
    if(elements.length > 0){
      for(let i=0;i < elements.length;i++){
        elements[i].classList.add('loader-img-div');
      }
    }
  };

  return (
    <React.Fragment>
      <div className="slider-wrapper small-cards-container">
        <div className="slider-container-title">
          <h5 className="headerText">
            {headerName === 'Trending games' ? (
              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-trending-games.svg" alt="cazi-trending-games"></img>
            ) : headerName === 'New games we love' ? (
              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-new-games.svg" alt="cazi-new-games" className="newGames"></img>
            ) : headerName === 'Best Slot games' ? (
              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-table-games.svg" alt="cazi-table-games" className="bestTableGame"></img>
            ) : headerName === 'Best Live games' ? (
              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-live-games.svg" alt="cazi-live-games"></img>
            ) : (
              ''
            )}
            <span className="header-sp">{headerName}</span>
          </h5>
        </div>

        <Swiper
          ref={swiperRef}
          loop={true}
          autoplay={{
            delay: timing,
            disableOnInteraction: false,
          }}
          spaceBetween={0}
          slidesPerGroup={1}
          // navigation
          observer={true}
          observeParents={true}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (
                swiper &&
                swiper.params &&
                swiper.params.navigation &&
                swiper.navigation
              ) {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
          breakpoints={{
            500: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            999: {
              slidesPerView: 4,
            },
            1300: {
              slidesPerView: 5,
            },
            1500: {
              slidesPerView: 6,
            },
          }}
        >
          <div
            ref={navigationPrevRef}
            className={'previous-custom ' + title}
            id="prev-custom-arrow"
          ></div>
          <div
            ref={navigationNextRef}
            className={'next-custom ' + title}
            id="next-custom-arrow"
          ></div>
          {loading ? (
            <ReactPlaceholder ready={loading}>
              {awesomePlaceholder}
            </ReactPlaceholder>
          ) : (
            data &&
            data.map((item, i) => {
              return (
                !GamesToHide.includes(item.game_name) && (
                  <SwiperSlide key={i + title}>
                    {
                      <Card onClick={() => goToGameDetails(item)}>
                        <div className="outer-div">
                          <div className="inner-div">
                            <div className="play-icon-div">
                              <img
                                alt="play-icon"
                                src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/play-triangle.svg"
                                className="play-icon"
                              ></img>
                            </div>
                          </div>
                        </div>
                        <div className={`card-img-wr image-outer-div-${i}-${title}`}>
                          {item && item.game_name !== ' CAI FU' ? (
                            <LazyLoadImage alt={item?.game_name} onError={(e)=> addDefaultSrc(e, i, title)} onLoad={setLoading}
                            style={{ width: '100%' }}
                            src={loaded === false ? loader_image : item.game_icon} />
                          ) : (
                            <LazyLoadImage alt={'CaiFu'}
                              onError={(e)=> addDefaultSrc(e, i, title)} onLoad={setLoading}
                              style={{ width: '100%' }}
                              src={loaded === false ? loader_image : "https://d2qrsf0anqrpxl.cloudfront.net/assets/images/CaiFu.png"}
                            />
                          )}
                        </div>
                        <Card.Body>
                          <Card.Subtitle className="text-overflow" as="h6">
                            {title === 'Evolution'
                              ? item.game_name
                              : title === 'Game_Slots'
                              ? item.game_name
                              : title === 'Providers'
                              ? item.game_name
                              : title === 'Live_Games'
                              ? item
                              : ''}
                          </Card.Subtitle>
                          <Card.Text className="text-overflow">
                            {title === 'Evolution'
                              ? item.game_provider
                              : title === 'Game_Slots'
                              ? item.game_provider
                              : title === 'Providers'
                              ? item.game_provider
                              : title === 'Live_Games'
                              ? item.provider
                              : title === 'Winners_List'
                              ? item.price
                              : ''}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    }
                  </SwiperSlide>
                )
              );
            })
          )}
        </Swiper>
      </div>
    </React.Fragment>
  );
}
