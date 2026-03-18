  function showFeature(name) {
            const toast = document.getElementById('toast');
            toast.textContent = `✨ ${name} 功能开发中，敬请期待 ✨`;
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        }

        window.onload = function() {
            if (typeof AMap !== 'undefined') {
                const map = new AMap.Map('miniMap', {
                    zoom: 13,
                    center: [104.072, 30.663],
                    mapStyle: 'amap://styles/whitesmoke',
                    features: ['bg', 'road', 'point']
                });
                AMap.plugin('AMap.Geolocation', () => {
                    const geolocation = new AMap.Geolocation({ enableHighAccuracy: true, timeout: 10000, buttonPosition: 'RB' });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition((status, result) => {
                        if (status === 'complete') {
                            AMap.service('AMap.PlaceSearch', () => {
                                const placeSearch = new AMap.PlaceSearch({ pageSize: 6, city: '成都', map: map });
                                placeSearch.searchNearBy('宠物医院', result.position, 3000);
                            });
                        }
                    });
                });
            }
        };

        document.getElementById('searchBtn')?.addEventListener('click', function() {
            const keyword = document.getElementById('searchInput').value;
            if (!keyword) return;
            if (typeof AMap !== 'undefined') {
                AMap.service('AMap.PlaceSearch', () => {
                    new AMap.PlaceSearch({ pageSize: 5, city: '成都' }).search(keyword, (status, result) => {
                        showFeature(status === 'complete' ? `找到 ${result.poiList.pois.length} 个相关结果` : '未找到相关地点');
                    });
                });
            } else {
                showFeature('地图服务未加载');
            }
        });

        document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') document.getElementById('searchBtn').click();
        });
