import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import classnames from 'classnames';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import styles from './Carousel.module.css';
import Transition from './Transition';

export const imageInfoList = [
  {
    title: '需求工程',
    url: 'https://node2d-public.hep.com.cn/37197bc254b97d32e5a1743d1428c44e.jpg-small?e=1709741130&token=fz_hnGR7k1CJg3gJX1rpSAWQve4fO7q2Ii7oUBxR:-ICrqml9NpE0GNWMuQ7aAU1e6lI=',
  },
  {
    title: '操作系统',
    url: 'https://node2d-public.hep.com.cn/bbd7693befd221e400c76cd30adb086d.jpg-small?e=1709742273&token=fz_hnGR7k1CJg3gJX1rpSAWQve4fO7q2Ii7oUBxR:Zn62YEcqP-WMlsKOH3dbSqeVnvs=',
  },
  {
    title: '计算机网络',
    url: 'https://node2d-public.hep.com.cn/0747dff8c1bf2f5d32531a6e5a9ec707.jpg-small?e=1709741710&token=fz_hnGR7k1CJg3gJX1rpSAWQve4fO7q2Ii7oUBxR:OFVZbtwB5rWnJgQldNA76WjcyPM=',
  },
];

const settings = {
  className: styles['slick-center'],
  centerMode: true,
  infinite: true,
  centerPadding: '10px',
  speed: 300,
  dots: false,
  focusOnSelect: true,
  arrows: false,
};

function Carousel() {
  const router = useRouter();
  const sliderRef = useRef(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const imageInfo = useMemo(() => {
    return imageInfoList[selectedImageIndex % imageInfoList.length];
  }, [selectedImageIndex]);

  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 850) {
        setSlidesToShow(1);
      } else if (screenWidth <= 1250) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handleImageClick = () => {
    if (!session) {
      signIn();
      return;
    }
    router.push('/chat/' + imageInfo.title);
  };
  const { token } = theme.useToken();

  return (
    <Transition>
      <div className={styles.container}>
        <Slider
          ref={sliderRef}
          {...settings}
          slidesToShow={slidesToShow}
          afterChange={(index) => setSelectedImageIndex(index)}
        >
          {[...imageInfoList, ...imageInfoList].map(({ url, title }, index) => {
            return (
              <div key={index}>
                <div
                  key={index}
                  className={classnames(styles['slider-item'], {
                    [styles.center]: selectedImageIndex === index,
                  })}
                >
                  <img src={url} alt={`Image ${index + 1}`} />
                  <div
                    style={{
                      textAlign: 'center',
                      color: token.colorText,
                    }}
                  >
                    {title}
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
        {slidesToShow > 1 && (
          <>
            <div className={styles.leftArrow} onClick={handlePrev}>
              <ArrowLeftOutlined style={{ fontSize: '32px', color: token.colorText }} />
            </div>
            <div className={styles.rightArrow} onClick={handleNext}>
              <ArrowRightOutlined style={{ fontSize: '32px', color: token.colorText }} />
            </div>
          </>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            alignItems: 'center',
          }}
        >
          <Button
            size="large"
            type="primary"
            onClick={() => {
              handleImageClick();
            }}
          >
            以《{imageInfo?.title}》开始对话
          </Button>
        </div>
      </div>
    </Transition>
  );
}

export default Carousel;
