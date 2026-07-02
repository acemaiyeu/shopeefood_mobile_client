import { SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const"
import { ScrollView, StyleSheet, Text, View } from "react-native"

const TosScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.item}>
                {/* <Text style={styles.item_header}></Text> */}
                <Text style={styles.item_title}>1. Quyền và nghĩa vụ </Text>
                <Text style={styles.item_title_1}>1.1 Quyền </Text>
                <Text style={styles.item_value}>- Đối với chúng tôi: có quyền hạn chế đặt hàng đối với người dùng khi có những hành vi tiêu cực ảnh hưởng trực tiếp đến cửa hàng, cũng như là người giao hàng. Chúng tôi cũng có quyền hạn chế việc bán hàng đối với nhà bán hàng nếu vi phạm chính sách nhà bán hàng (Xem bên app bán hàng)
                </Text>
                <Text style={styles.item_value}>- Đối với người dùng (khách hàng, nhà bán hàng, người giao hàng): có quyền đánh giá đối với sản phẩm và người giao hàng với tiêu chí đúng sự thật, quyền kháng cáo đối với những lần bị đánh giá không tốt từ cửa hàng, người giao hàng hoặc từ khách hàng </Text>
                <Text style={styles.item_title_1}>1.2 Nghĩa vụ </Text>
                <Text style={styles.item_value}>- Đối với người dùng (khách hàng, nhà bán hàng, người giao hàng): có nghĩa vụ sử dụng đúng mục đích phần mềm, tránh hành vi gian lận, thù địch, đánh giá sai sự thật</Text>
                <Text style={styles.item_value}>- Chúng tôi có nghĩa vụ bảo vệ khách hàng (khách hàng, nhà bán hàng, người giao hàng) trên tiêu chí có đầy đủ thông tin kháng cáo, như hình ảnh, bằng chứng,... và cuối cùng phải dựa trên tình người</Text>
                <Text style={styles.item_title}>2. Quy trình giao dịch: </Text>
                <Text style={styles.item_value}>- Bước 1: Khách hàng vào app và chọn sản phẩm cần mua</Text>
                <Text style={styles.item_value}>- Bước 2: Khách hàng qua giỏ hàng để xem chi tiết và sử dụng các mã giảm giá (nếu có) từ cửa hàng</Text>
                <Text style={styles.item_value}>- Bước 3: Chọn phương thức thanh toán</Text>
                <Text style={styles.item_value}>- Bước 4: Kiểm tra kỹ lại thông tin cần thanh toán ở mục Thanh toán, đặc biệt số tiền cần thanh toán</Text>
                <Text style={styles.item_value}>- Bước 5: Bấm đặt hàng</Text>
                <Text style={styles.item_value}>- Bước 6: (Áp dụng đối với chuyển khoản) Màn hình chuyển qua phần quét mã qr thanh toán</Text>
                <Text style={styles.item_value}>- Bước 6.1: Khi cửa hàng nhận đơn, tại màn hình của khách hàng sẽ hiện ra mã QR thanh toán (kèm thời gian hết hạn)</Text>
                <Text style={styles.item_value}>- Bước 6.2: Người dùng quét mã QR và tiến hành thanh toán</Text>
                <Text style={styles.item_value}>- Bước 7: Xem chi tiết cũng như trạng thái đơn hàng tại Đơn hàng</Text>
                <Text style={styles.item_value}>- Bước 8: Chờ người giao hàng gọi điện để nhận hàng</Text>
                <Text style={styles.item_value}>- Bước 8: Chờ người giao hàng gọi điện để nhận hàng</Text>
                <Text style={styles.item_title}>3. Chính sách bảo mật thông tin</Text>
                <Text style={styles.item_value}>- Đối với người dùng chúng tôi rất hiểu rõ "Dữ liệu cá nhân" quan trọng như thế nào đối với khách hàng. Quý khách hàng đã tin tưởng giao dữ liệu cho chúng tôi thì chúng tôi phải có trách nhiệm bảo quản và xử lý dữ liệu một cách hợp lý. Chính sách bảo mật này giúp bạn hiểu rõ hơn được cách thức chúng tôi thu thập, sử dụng, tiết lộ và xử lý dữ liệu cá nhân mà bạn đã cung cấp cho chúng tôi.</Text>
                <Text style={styles.item_value}>- Dữ liệu cá nhân có nghĩa là dữ liệu mà chúng tôi dùng để xác nhận danh tính của bạn, đồng thời để cửa hàng và người giao hàng có thể liên hệ với bạn khi giao hàng cũng như giải quyết các khiếu nại hoặc những việc có liên quan</Text>
                <Text style={styles.item_value}>- Bằng việc sử dụng Các Dịch Vụ, đăng ký tài khoản với chúng tôi, truy cập nền tảng và sử dụng các dịch vụ đồng nghĩa với việc bạn đã đồng ý chấp nhận các phương pháp, cách thức và chính sách được mô tả trong Chính sách bảo mật này. Cũng như bạn cho phép chúng tôi thu thập, sử dụng, hoặc tiết lộ (với cơ quan nhà nước)/xử lý dữ liệu cá nhân của bạn như mô tả.</Text>
                <Text style={styles.item_value}>- KHI NÀO CHÚNG TÔI THU THẬP DỮ LIỆU CÁ NHÂN CỦA BẠN</Text>
                <Text style={styles.item_value}>+ Khi bạn đăng ký tài khoản</Text>
                <Text style={styles.item_value}>+ Khi bạn cung cấp thông tin địa chỉ giao hàng</Text>
                <Text style={styles.item_value}>+ Các form đăng ký, cung cấp thông tin, thỏa thuận có liên quan giữa bạn với chúng tôi</Text>
                <Text style={styles.item_value}>+ Khi bạn tương tác với chúng tôi: như thông qua các cuộc gọi (có thể được ghi âm lại), thư từ, gặp gỡ trực tiếp, email, tương tác với chăm sóc khách hàng,...</Text>
                <Text style={styles.item_value}>+ Khi bạn cấp phép thiết bị của bạn để chia sẻ thông tin với ứng dụng hoặc với nền tảng của chúng tôi</Text>
                <Text style={styles.item_value}>+ Khi bạn liên kết tài khoản Google</Text>
                <Text style={styles.item_value}>+ Khi bạn thực hiện các giao dịch thông qua Dịch vụ của chúng tôi</Text>
                <Text style={styles.item_value}>+ Khi bạn cung cấp ý kiến phản hồi, bình luận, đánh giá hoặc gửi khiếu nại cho chúng tôi</Text>
                <Text style={styles.item_value}>+ Khi bạn gửi dữ liệu cá nhân cho chúng tôi vì bất cứ lý do gì</Text>
                <Text style={styles.item_value}>+ Và những tình huống khác</Text>
                <Text style={styles.item_value}>- Những gì chúng tôi thu thập</Text>
                <Text style={styles.item_value}>+ Họ tên</Text>
                <Text style={styles.item_value}>+ Địa chỉ email</Text>
                <Text style={styles.item_value}>+ Ngày tháng năm sinh</Text>
                <Text style={styles.item_value}>+ Địa chỉ nhận hàng</Text>
                <Text style={styles.item_value}>+ Số điện thoại nhận hàng</Text>
                <Text style={styles.item_value}>+ Thông tin thiết bị</Text>
                <Text style={styles.item_value}>+ Hình ảnh mà bạn chia sẻ cho chúng tôi</Text>
                <Text style={styles.item_value}>+ Giấy tờ tùy thân do chính phủ cấp hoặc thông tin khác cần thiết cho sự thẩm định của chúng tôi, nhận biết khách hàng của bạn, xác minh danh tính hoặc các mục đích phòng chống gian lận</Text>
                <Text style={styles.item_value}>+ Dữ liệu sử dụng để giao dịch</Text>
                <Text style={styles.item_value}>+ Dữ liệu định vị</Text>
                <Text style={styles.item_value}>+ Bất kỳ dữ liệu nào khác về người dùng khi người dùng đăng nhập và sử dụng dịch vụ của chúng tôi</Text>
                <Text style={styles.item_value}>- Nếu bạn KHÔNG ĐỒNG Ý CHO PHÉP SỬ DỤNG DỮ LIỆU CÁ NHÂN của mình, VUI LÒNG KHÔNG SỬ DỤNG CÁC DỊCH VỤ của chúng tôi.</Text>
                <Text style={styles.item_value}>- Nếu bạn chúng tôi thay đổi chính sách bảo mật sẽ được thông báo cho bạn trên nền tảng của phần mềm</Text>
                <Text style={styles.item_value}>- Chính sách này được áp dụng khi bạn bắt đầu tạo tài khoản và sử dụng các dịch vụ của chúng tôi</Text>
                <Text style={styles.item_value}>- Chính sách này được áp dụng khi bạn bắt đầu tạo tài khoản và sử dụng các dịch vụ của chúng tôi</Text>
                <Text style={styles.item_title}>4. Thanh toán</Text>
                <Text style={styles.item_value}>- Khách hàng có thể thanh toán qua bất kỳ ngân hàng nào</Text>
                <Text style={styles.item_title}>5. Hủy đơn</Text>
                <Text style={styles.item_value}>- Bạn có quyền hủy đơn khi đơn hàng chưa được nhà bán hàng nhận đơn hoặc do nhà bán hàng hủy do lý do của nhà bán hàng</Text>
                <Text style={styles.item_title}>6. Hoàn tiền</Text>
                <Text style={styles.item_value}>- Người mua sẽ được hoàn tiền cho các đơn hàng do lỗi người bán, do lỗi bên thực hiện giao nhận và các trường hợp khác không phải do lỗi của Người mua. Nhà bán hàng hoàn tiền không quá 2 tiếng, Nền tảng hoàn tiền không quá 3 ngày</Text>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 10,
        height: "100%",
        // marginBottom: 20
    },
    item: {
        alignItems: 'flex-start',
    },
    item_title: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 14
    },
    item_title_1: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 12
    },
    item_value: {
        fontFamily: SF_Pro,
        fontSize: 12
    }
})
export default TosScreen;