let geocoder = null;
export function getAddress(center) {
  if (Array.isArray(center)) center = new AMap.LngLat(center[0], center[1]);
  return new Promise((resolve, reject) => {
    startLoading();
    const resolveMethod = () => {
      geocoder.getAddress(center, (status, result) => {
        stopLoading();
        if (status === 'complete' && result.info === 'OK') {
          let addressComponent = result.regeocode.addressComponent;
          resolve({
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district,
            cityCode: addressComponent.adcode
          });
        } else {
          reject(result);
        }
      });
    };
    if (!geocoder) {
      lazyAMapApiLoaderInstance.load().then(_ => {
        geocoder = new AMap.Geocoder({});
        resolveMethod();
      });
    } else {
      resolveMethod();
    }
  });
}
