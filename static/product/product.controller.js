/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', 'ProductService', '$rootScope', '$uibModal', '$timeout', '$location'];
    function ProductController($scope, ProductService, $rootScope, $uibModal, $timeout, $location) {
        $scope.listProduct = [];
        $scope.order = {};
        $scope.zptranstoken = "";
        $scope.appid = 0;
        var res = {};
        $scope.l_pro = [];
        $scope.total_money = 0;
        var foodItems = [];
        $scope.getListProduct = function () {
//            ProductService.getListProduct()
//            .then(function (response) {  
//                console.log(JSON.stringify(response));
//                if (response.err === 0) {
//                                      
//                } else if (response.err === 101) {      // has not logged in
//                    $location.path('/login');
//                } else {
//                    console.log("error getListProduct");
//                }
//            });
            var data = '{"err":0,"msg":"No error","dt":{"categories":[{"category_id":0,"category_name":"Tất cả","order":0,"status":1,"category_value":0},{"category_id":1,"category_name":"Sáng","order":1,"status":1,"category_value":1},{"category_id":2,"category_name":"Trưa","order":2,"status":1,"category_value":2},{"category_id":3,"category_name":"Chiều","order":3,"status":1,"category_value":4},{"category_id":4,"category_name":"Thức uống","order":4,"status":1,"category_value":8}],"items":[{"item_id":82,"item_name":"Phở bò","item_code":"SP059","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1497830277266.JPG","img_crc":"1497830277512","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-03 20:36:37","order":2,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":1,"item_name":"Bún bò huế","item_code":"SP00","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476761193510.png","img_crc":"1476761193524","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:15:00","order":3,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":50,"item_name":"Bánh hỏi thịt quay","item_code":"SP041","price":20000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1468407982959.jpg","img_crc":"1468407983053","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-27 07:26:14","order":4,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":29,"item_name":"Gỏi cuốn ( 2 cuốn)","item_code":"SP029","price":12000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468408452744.jpg","img_crc":"1468408452836","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:44:19","order":5,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":8,"item_name":"Bánh ướt chả lụa","item_code":"SP008","price":15000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1468464249601.jpg","img_crc":"1468464249692","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:14:40","order":6,"original_price":15000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":19,"item_name":"Xôi mặn","item_code":"SP019","price":15000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468464099974.jpg","img_crc":"1468464100070","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-04 19:41:11","order":7,"original_price":15000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":57,"item_name":"Bánh đúc","item_code":"","price":12000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1475641911855.jpg","img_crc":"1475641911869","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-05 13:22:39","order":8,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":88,"item_name":"Hủ tiếu(Mì) sườn kho, bò viên","item_code":"SP070","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1496984171594.jpg","img_crc":"1496984171616","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:10:37","order":9,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":10,"item_name":"Hủ tiếu Nam Vang","item_code":"SP063","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1475555063078.jpg","img_crc":"1475555063095","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-04 19:41:35","order":10,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":78,"item_name":"Hủ tiếu, mì xá xíu, hoành thánh","item_code":"SP054","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469866251989.jpg","img_crc":"1469866252083","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:12:06","order":11,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":7,"item_name":"Mì gà tiềm/ đùi gà HK","item_code":"SP007","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469869637203.jpg","img_crc":"1469869637293","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:12:20","order":12,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":16,"item_name":"Bò kho,(hủ tíu,mì,bánh mì)","item_code":"SP016","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1478130972531.JPG","img_crc":"1478130972560","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:44:30","order":13,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":75,"item_name":"Mì Quảng","item_code":"SP051","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1470110252977.jpg","img_crc":"1470110253080","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 19:13:05","order":14,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":14,"item_name":"Cari gà","item_code":"SP014","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469869346573.jpg","img_crc":"1469869346665","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-05 13:22:49","order":15,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":18,"item_name":"Bún gạo xào","item_code":"SP018","price":18000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468464111716.jpg","img_crc":"1468464111812","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-05 13:31:54","order":18,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":2,"item_name":"Bún Mọc","item_code":"SP002","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1469869803565.jpg","img_crc":"1469869803651","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:44:36","order":19,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":22,"item_name":"Bún mắm","item_code":"SP022","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469868986371.jpg","img_crc":"1469868986470","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-04 19:41:53","order":21,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":21,"item_name":"Bún Thịt Bò Xào","item_code":"SP021","price":25000,"category_name":"Trưa","img_path":"/resource/canteenvng/items/1469869120970.jpg","img_crc":"1469869121077","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:44:41","order":22,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":2},{"item_id":17,"item_name":"Bún thịt nướng","item_code":"SP017","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468464118104.jpg","img_crc":"1468464118194","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:44:40","order":23,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":15,"item_name":"Bún, miến gà","item_code":"SP015","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1497830942138.JPG","img_crc":"1497830942341","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-22 04:14:01","order":24,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":13,"item_name":"Bún thái","item_code":"SP013","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1491799196098.jpg","img_crc":"1491799196114","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:46:08","order":25,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":83,"item_name":"Bún riêu","item_code":"SP060","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1470136541444.jpg","img_crc":"1470136541623","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-28 04:34:41","order":26,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":6},{"item_id":74,"item_name":"Bún cari gà","item_code":"SP050","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469866472386.jpg","img_crc":"1469866472480","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-05 13:23:03","order":28,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":77,"item_name":"Bánh canh (Nui) sườn, bò viên","item_code":"SP053","price":25000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469866349727.jpg","img_crc":"1469866349816","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-03 20:37:21","order":30,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":85,"item_name":"Bánh canh giò heo","item_code":"SP062","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1470194976280.jpg","img_crc":"1470194976514","description":"","inventory":0,"status":0,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-05 13:23:06","order":32,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":20,"item_name":"Cơm trưa","item_code":"SP020","price":30000,"category_name":"Trưa","img_path":"/resource/canteenvng/items/1476761168686.png","img_crc":"1476761168698","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-19 06:53:35","order":33,"original_price":30000,"promotion_type":0,"promotion_id":0,"cate_mask":2},{"item_id":84,"item_name":"Mì xào bò trứng ốp la","item_code":"SP064","price":30000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476418917186.JPG","img_crc":"1476418917365","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:55:40","order":34,"original_price":30000,"promotion_type":0,"promotion_id":0,"cate_mask":5},{"item_id":101,"item_name":"Mì xào thịt bò","item_code":"","price":25000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499338692541.JPG","img_crc":"1499338692597","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:58:12","order":35,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":11,"item_name":"Nui xào thịt bò","item_code":"SP011","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1469869546153.jpg","img_crc":"1469869546248","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 17:59:03","order":36,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":102,"item_name":"Nui xào thịt bò, trứng opla","item_code":"","price":30000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499339421263.JPG","img_crc":"1499339421338","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 07:55:00","order":37,"original_price":30000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":106,"item_name":"Mì xào thịt bò 2 vắt","item_code":"","price":28000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499397354799.JPG","img_crc":"1499397354982","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 10:15:54","order":38,"original_price":28000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":91,"item_name":"Bánh mì bò","item_code":"SP073","price":25000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1483056981460.JPG","img_crc":"1483056981624","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-26 11:14:46","order":40,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":5},{"item_id":12,"item_name":"Bánh mì cá/ ốp la","item_code":"SP012","price":23000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1476419708207.JPG","img_crc":"1476419708392","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-26 11:13:57","order":41,"original_price":23000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":6,"item_name":"Bánh mì cá hộp","item_code":"SP006","price":18000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1468464276325.jpg","img_crc":"1468464276416","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:25:49","order":42,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":4,"item_name":"Bánh mì ốp la","item_code":"SP004","price":15000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1468464301783.jpg","img_crc":"1468464301873","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-26 11:12:41","order":43,"original_price":15000,"promotion_type":0,"promotion_id":0,"cate_mask":5},{"item_id":76,"item_name":"Bánh mì bò 1 trứng ôp la","item_code":"SP052","price":28000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1483057057868.JPG","img_crc":"1483057058061","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-26 11:09:17","order":44,"original_price":28000,"promotion_type":0,"promotion_id":0,"cate_mask":5},{"item_id":5,"item_name":"Bánh mì bò 2 trứng opla","item_code":"SP005","price":32000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1483057591827.JPG","img_crc":"1483057592046","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-26 11:11:22","order":45,"original_price":32000,"promotion_type":0,"promotion_id":0,"cate_mask":5},{"item_id":110,"item_name":"Nui xào trứng","item_code":"","price":18000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499392203953.JPG","img_crc":"1499392203985","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:50:03","order":47,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":100,"item_name":"Bột chiên","item_code":"","price":20000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1498738190525.JPG","img_crc":"1498738190602","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-30 06:18:04","order":48,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":111,"item_name":"Mì xào trứng","item_code":"","price":18000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499392298963.JPG","img_crc":"1499392299002","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:51:39","order":49,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":1},{"item_id":80,"item_name":"Chả giò dĩa lớn","item_code":"SP055","price":24000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469765843017.jpg","img_crc":"1469765843110","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:29:03","order":62,"original_price":24000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":81,"item_name":"Chả giò dĩa nhỏ","item_code":"SP058","price":12000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469766224490.jpg","img_crc":"1469766224592","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-29 12:31:20","order":63,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":24,"item_name":"Cá viên chiên (nhỏ)","item_code":"SP024","price":12000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469765957574.jpg","img_crc":"1469765957676","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:29:59","order":64,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":25,"item_name":"Cá viên chiên (lớn)","item_code":"SP025","price":24000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468408519186.jpg","img_crc":"1468408519272","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:30:13","order":65,"original_price":24000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":26,"item_name":"Hột vịt lộn 1 trứng","item_code":"SP026","price":7000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476761286888.png","img_crc":"1476761286899","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:30:31","order":66,"original_price":7000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":27,"item_name":"Vịt lộn xào me","item_code":"SP027","price":10000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1468408506945.jpg","img_crc":"1468408507036","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:30:46","order":67,"original_price":10000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":93,"item_name":"Chả giò hải sản","item_code":"","price":10000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476869374457.jpg","img_crc":"1476869374482","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:31:11","order":68,"original_price":10000,"promotion_type":0,"promotion_id":0,"cate_mask":4},{"item_id":41,"item_name":"Bánh flan (2cai)","item_code":"SP040","price":12000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1476101647271.JPG","img_crc":"1476101647319","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:16:56","order":69,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":87,"item_name":"Chè","item_code":"","price":10000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476771345685.jpg","img_crc":"1476771345703","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 07:58:08","order":70,"original_price":10000,"promotion_type":0,"promotion_id":0,"cate_mask":10},{"item_id":86,"item_name":"Dừa trái","item_code":"SP065","price":17000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475466228562.jpg","img_crc":"1475466228608","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:14:14","order":71,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":103,"item_name":"Tắc tuyết","item_code":"","price":20000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499354821683.JPG","img_crc":"1499354821738","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:35:02","order":72,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":95,"item_name":"Chanh Tuyết","item_code":"SP076","price":20000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1480582020241.png","img_crc":"1480582020256","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:36:12","order":73,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":92,"item_name":"Trà đào","item_code":"","price":20000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1476770043769.jpg","img_crc":"1476770043786","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:14:30","order":74,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":39,"item_name":"Yaourt đào xay","item_code":"SP039","price":25000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475557117173.jpg","img_crc":"1475557117194","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:15:40","order":77,"original_price":25000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":35,"item_name":"Yaourt đá 1 hủ","item_code":"SP035","price":12000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1469867730899.jpg","img_crc":"1469867730996","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:29:40","order":78,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":37,"item_name":"Yaourt trái cây","item_code":"SP037","price":20000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1470370594889.jpg","img_crc":"1470370595023","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:15:56","order":79,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":96,"item_name":"Yaourt đá 2 hủ","item_code":"","price":18000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1497499271048.jfif","img_crc":"1497499271081","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:16:13","order":80,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":105,"item_name":"Nước chanh( chanh muối)","item_code":"","price":12000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1499355163226.JPG","img_crc":"1499355163298","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:32:43","order":81,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":104,"item_name":"Nước suối","item_code":"","price":8000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499355090200.JPG","img_crc":"1499355090381","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-06 22:31:30","order":82,"original_price":8000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":36,"item_name":"Yaourt nếp than","item_code":"SP036","price":15000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1469867549176.jpg","img_crc":"1469867549282","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:34:10","order":83,"original_price":15000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":89,"item_name":"Yaourt hủ","item_code":"SP072","price":7000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1493268297330.PNG","img_crc":"1493268297507","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:34:26","order":84,"original_price":7000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":58,"item_name":"Bò cụng","item_code":"SP047","price":13000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1470111315202.jpg","img_crc":"1470111315300","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:40:20","order":85,"original_price":13000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":31,"item_name":"Nước ngọt","item_code":"SP031","price":11000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1495772688006.JPG","img_crc":"1495772688334","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:40:34","order":86,"original_price":11000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":72,"item_name":"Thức uống có yaourt","item_code":"SP048","price":22000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1497500067969.jpg","img_crc":"1497500068001","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:34:52","order":87,"original_price":22000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":98,"item_name":"Nutri Bootst","item_code":"","price":12000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1497499565793.png","img_crc":"1497499565801","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:35:26","order":88,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":107,"item_name":"Nước ép thơm","item_code":"","price":17000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499389685494.JPG","img_crc":"1499389685547","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:08:05","order":89,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":108,"item_name":"Nước ép chanh dây","item_code":"","price":17000,"category_name":"Sáng","img_path":"/resource/canteenvng/items/1499389725371.JPG","img_crc":"1499389725426","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:08:45","order":90,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":55,"item_name":"Trái cây tô","item_code":"SP044","price":30000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475556935344.jpg","img_crc":"1475556935371","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:35:44","order":91,"original_price":30000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":73,"item_name":"Nước cam( nước ép trái cây)","item_code":"SP049","price":17000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1468408410420.jpg","img_crc":"1468408410530","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:05:26","order":92,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":90,"item_name":"Trái cây nhỏ","item_code":"","price":30000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1476685285139.jpg","img_crc":"1476685285158","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:35:56","order":93,"original_price":30000,"promotion_type":0,"promotion_id":0,"cate_mask":7},{"item_id":56,"item_name":"Trái cây lớn","item_code":"SP045","price":50000,"category_name":"Chiều","img_path":"/resource/canteenvng/items/1469866884062.jpg","img_crc":"1469866884160","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:36:19","order":94,"original_price":50000,"promotion_type":0,"promotion_id":0,"cate_mask":7},{"item_id":109,"item_name":"Nước ép cam cà rốt","item_code":"","price":22000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1499390345609.JPG","img_crc":"1499390345640","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:19:05","order":95,"original_price":22000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":79,"item_name":"Nước ép thơm cà rốt","item_code":"SP056","price":22000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1469866081280.jpg","img_crc":"1469866081401","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-07-07 08:18:06","order":96,"original_price":22000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":32,"item_name":"Sinh tố","item_code":"SP032","price":17000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1469868721789.jpg","img_crc":"1469868721887","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:38:03","order":97,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":97,"item_name":"Sữa tươi cafe","item_code":"","price":11000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1497499367191.jpg","img_crc":"1497499367201","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:42:43","order":98,"original_price":11000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":99,"item_name":"Cafe đen đá (nhỏ)","item_code":"","price":10000,"category_name":"Tất cả","img_path":"/resource/canteenvng/items/1497499679884.jpg","img_crc":"1497499681877","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:41:56","order":99,"original_price":10000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":53,"item_name":"Cafe đen đá (lớn)","item_code":"SP043","price":17000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475555003050.jpg","img_crc":"1475555003070","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:44:06","order":100,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":33,"item_name":"Cafe sữa đá (nhỏ)","item_code":"SP033","price":12000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475555035351.jpg","img_crc":"1475555035385","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:44:34","order":101,"original_price":12000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":3,"item_name":"Cafe sữa đá (lớn)","item_code":"SP003","price":18000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1476678441987.jpg","img_crc":"1476678442017","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:43:20","order":102,"original_price":18000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":34,"item_name":"Cafe Đông Sương","item_code":"","price":17000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1475556146670.jpg","img_crc":"1475556146689","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:45:00","order":103,"original_price":17000,"promotion_type":0,"promotion_id":0,"cate_mask":8},{"item_id":38,"item_name":"Cafe đá xay","item_code":"SP038","price":20000,"category_name":"Thức uống","img_path":"/resource/canteenvng/items/1469867313004.jpg","img_crc":"1469867313095","description":"","inventory":0,"status":1,"create_by":"","create_date":"","barcode":"","modified_by":"nguyenductrung226","modified_date_time":"2017-06-16 18:45:16","order":104,"original_price":20000,"promotion_type":0,"promotion_id":0,"cate_mask":8}],"img_host":"https://vpos.zing.vn/vpos","last_update":1499397354982}}';
            res = JSON.parse(data);
            $scope.l_pro = res.dt.items;
            for (var i in $scope.l_pro) {
                $scope.l_pro[i].bgcolor = "white";
                $scope.l_pro[i].quantity = "";
                $scope.l_pro[i].icon_minus = "";
                $scope.l_pro[i].icon_plus = "";
                $scope.l_pro[i].img_path = "https://vpos.zing.vn" + $scope.l_pro[i].img_path;
                $scope.l_pro[i].img_checked = "img/checked.png";
                $scope.l_pro[i].img = $scope.l_pro[i].img_path;
            }
//            init();
//            initJsBrige();
        };
        $scope.getListProduct();

        $scope.selectItem = function (item) {
            console.log("===select item===");
            for (var i in $scope.l_pro) {
                if ($scope.l_pro[i].item_id === item.item_id) {
                    if (item.quantity === "") {
                        item.quantity = 0;
                    }
                    $scope.l_pro[i].bgcolor = "#E0E0E0";
                    $scope.l_pro[i].img = $scope.l_pro[i].img_checked;
                    var item_quantity = item.quantity + 1;
                    var item_amount = item.price * item_quantity;
                    var _find = true;
                    $scope.l_pro[i].quantity = item_quantity;
                    $scope.l_pro[i].icon_minus = "-";
                    $scope.l_pro[i].icon_plus = "+";
                    var _item = {
                        index: item.item_id,
                        item_name: item.item_name,
                        quantity: item_quantity,
                        price: item.price,
                        amount: item_amount,
                        original_price: 0.0,
                        promotion_type: 0.0
                    };

                    for (var j in foodItems) {
                        if (foodItems[j].index === item.item_id) {
                            foodItems[j].quantity = foodItems[j].quantity + 1;
                            foodItems[j].amount = foodItems[j].quantity * foodItems[j].price;
                            $scope.total_money = $scope.total_money + foodItems[j].amount - ((foodItems[j].quantity - 1) * foodItems[j].price);
                            _find = false;
                            break;
                        }
                    }
                    if (_find) {
                        foodItems.push(_item);
                        $scope.total_money = $scope.total_money + _item.amount;
                    }
                    break;
                }
            }
        };

        $scope.deleteItem = function (item) {
            var _find = false;
            for (var i in foodItems) {
                if (item.item_id === foodItems[i].index)
                {
                    for (var j in $scope.l_pro) {
                        if ($scope.l_pro[j].item_id === item.item_id) {
                            $scope.l_pro[j].bgcolor = "white";
                            $scope.l_pro[j].img = $scope.l_pro[i].img_path;
                            $scope.l_pro[j].quantity = "";
                            $scope.l_pro[j].icon_minus = "";
                            $scope.l_pro[j].icon_plus = "";
                            break;
                        }
                    }
                    $scope.total_money = $scope.total_money - foodItems[i].amount.toString();
                    foodItems.splice(i, 1);
                    _find = true;
                    break;
                }
            }
            if (!_find) {
                $scope.selectItem(item);
            }
        };

        $scope.change_quantity = function (_math, item) {
            if (_math === "-") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        $scope.total_money = $scope.total_money  - foodItems[i].amount;
                        foodItems.splice(i, 1);
                        for (var j in $scope.l_pro) {
                            if ($scope.l_pro[j].item_id === item.item_id) {
                                if($scope.l_pro[j].quantity === 1) {
                                    $scope.l_pro[j].quantity = "";
                                    $scope.l_pro[j].bgcolor = "white";
                                    $scope.l_pro[j].img = $scope.l_pro[i].img_path;
                                    $scope.l_pro[j].icon_minus = "";
                                    $scope.l_pro[j].icon_plus = "";
                                    break;
                                }
                                $scope.l_pro[j].bgcolor = "#E0E0E0";
                                $scope.l_pro[j].img = "img/checked.png";
                                $scope.l_pro[j].quantity = $scope.l_pro[j].quantity - 1;
                                var _item = {
                                    index: item.item_id,
                                    item_name: item.item_name,
                                    quantity: $scope.l_pro[j].quantity,
                                    price: item.price,
                                    amount: $scope.l_pro[j].quantity * item.price,
                                    original_price: 0.0,
                                    promotion_type: 0.0
                                };
                                foodItems.push(_item);
                                $scope.total_money = $scope.total_money + _item.amount;
                                break;
                            }
                        }                        
                        break;
                    }
                }
            }

            if (_math === "+") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        $scope.total_money = $scope.total_money  - foodItems[i].amount;
                        foodItems.splice(i, 1);
                        for (var j in $scope.l_pro) {
                            if ($scope.l_pro[j].item_id === item.item_id) {
                                $scope.l_pro[j].quantity = $scope.l_pro[j].quantity + 1;
                                var _item = {
                                    index: item.item_id,
                                    item_name: item.item_name,
                                    quantity: $scope.l_pro[j].quantity,
                                    price: item.price,
                                    amount: $scope.l_pro[j].quantity * item.price,
                                    original_price: 0.0,
                                    promotion_type: 0.0
                                };
                                foodItems.push(_item);
                                $scope.total_money = $scope.total_money + _item.amount;
                                break;
                            }
                        }                        
                        break;
                    }
                }
            }
        };
        
        $scope.bill = function() {
            if(foodItems.length >0) {
                $rootScope.globals.listItemSelected = foodItems;
                $location.path("/bill");
            } else {
                alert("Vui lòng chọn sản phẩm.");
            }
        };

        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }
        function init() {
            for (var i = 0; i < 2; i++) {
                var item = {};
                item["pro_name"] = "Durex - " + (i + 1);
                item["pro_price"] = 30000;
                item["pro_location"] = i + 1;
                item["pro_img"] = "durex-" + (i + 1) + ".jpg";
                l_pro.push(item);
            }
            $scope.listProduct = l_pro;
        }

        $scope.createOrder = function (amount, item) {
            ZaloPay.showLoading();
            ProductService.createOrder(amount, item).then(function (response) {
                if (response.returncode === 1) {
                    ZaloPay.hideLoading();
                    $scope.order = JSON.parse(response.data.qrinfo);
                    $scope.zptranstoken = $scope.order.zptranstoken;
                    $scope.appid = $scope.order.appid;
                    ZaloPay.payOrder({
                        appid: $scope.appid,
                        zptranstoken: $scope.zptranstoken
                    }, cb);
//                    window.location.href = "https://zalopay.com.vn/openapp/index.html?appid=" + $scope.appid + "&zptranstoken=" + $scope.zptranstoken;                     
                } else {
                    console.log("error when create order");
                    alert("can't call api");
                }
            });
        };
        var cb = function (data) {
            if (typeof data === "object") {
                if (data.error === 1) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán đơn hàng thành công",
                        button: "OK"
                    });
                } else if (data.error === 4) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Người dùng huỷ đơn hàng",
                        button: "OK"
                    });
                } else {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán thất bại, errorcode: " + data.errorCode,
                        button: "OK"
                    });
                }
            }
        };
    }
})();