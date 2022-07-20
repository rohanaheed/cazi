import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'react-placeholder/lib/reactPlaceholder.css';
import ReactPlaceholder from 'react-placeholder';
import './providers-slider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
SwiperCore.use([Autoplay]);
const windowWidth = window.innerWidth;
const awesomePlaceholder = (
  windowWidth > 499 ?
  <div style={{width: '100%',height: '150px',display: 'flex',backgroundColor: 'white',}}>
    <div style={{ width: '19.5%',marginRight: '10px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={4} color="gainsboro" />
    </div>
    <div style={{ width: '19.5%',marginRight: '10px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={4} color="gainsboro" />
    </div>
    <div style={{ width: '19.5%',marginRight: '10px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={4} color="gainsboro" />
    </div>
    <div style={{ width: '19.5%',marginRight: '10px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={4} color="gainsboro" />
    </div>
    <div style={{ width: '19.5%',marginRight: '10px',height: '100%',backgroundColor: 'gainsboro',}}>
      <RectShape color="gainsboro" />
      <TextBlock rows={4} color="gainsboro" />
    </div>
  </div>:  <div style={{width: '100%',height: '150px',display: 'flex',backgroundColor: 'white',}}>
    <div style={{ width: '100%',marginRight: '0',height: '100%',backgroundColor: 'gainsboro',}}>
        <RectShape color="gainsboro" />
        <TextBlock rows={6} color="gainsboro" />
    </div>
  </div>
);

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default function ProvidersCarousel({ data, loading }) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);

  const setLoading = ()=>{
    setLoaded(true);
  }

  const goToGameDetails = (item) => {
    history.push(`/games-list/${item.provider_id}`);
  };
  //show default image
  const addDefaultSrc = (ev) => {
    ev.target.src = "https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/loader.gif";
  };

  const getImageName = (icon) => {
    let arr = icon.split('/');
    let game_name = arr[arr.length - 1];
    return game_name;
  };

  return (
    <React.Fragment>
      <div className="provider-container">
        <div className="slider-container-title">
          <h5>
            <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-providers.svg" alt="cazi-provider" className="gameProvider"></img>
            <span className="header-sp">Game Providers</span>
          </h5>
        </div>

        <Swiper
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={10}
          slidesPerGroup={1}
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
              slidesPerView: 5,
            },
            1200: {
              slidesPerView: 6,
            },
            1300: {
              slidesPerView: 8,
            },
            1920: {
              slidesPerView: 12,
            },
          }}
        >
          <div
            ref={navigationPrevRef}
            className="previous-custom"
            id="prev-custom-arrow"
          ></div>
          <div
            ref={navigationNextRef}
            className="next-custom"
            id="next-custom-arrow"
          ></div>

          {loading ? (
            <ReactPlaceholder ready={loading}>
              {awesomePlaceholder}
            </ReactPlaceholder>
          ) : (
            data.map((item, i) => {
              return (
                <SwiperSlide
                  key={i}
                  className="providers-carousel"
                  onClick={() => goToGameDetails(item)}
                >
                   <LazyLoadImage alt={item?.provider_name} onError={addDefaultSrc} onLoad={setLoading}
                            style={{ width: 'auto', height:'107px' }}
                            src={loaded === false ? "https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/loader.gif" : `https://d2qrsf0anqrpxl.cloudfront.net/assets/providers-logo/${getImageName(
                              item.icon
                            )}`} />
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </div>
    </React.Fragment>
  );
}
