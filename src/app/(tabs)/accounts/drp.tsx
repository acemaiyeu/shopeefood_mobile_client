import { SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const"
import { ScrollView, StyleSheet, Text, View } from "react-native"

const DrpScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.item}>
                {/* <Text style={styles.item_header}></Text> */}
                <Text style={styles.item_title}>Quy trình giải quyết tranh chấp, khiếu nại</Text>
                <Text style={styles.item_value}>- Quán nhỏ và Nhà bán hàng có trách nhiệm tiếp nhận khiếu nại và hỗ trợ Người mua liên quan đến ứng dụng Quán nhỏ</Text>
                <Text style={styles.item_value}>- Khi phát sinh tranh chấp, Chúng tôi đề cao giải pháp thương lượng, hòa giải giưa các bên nhằm duy trì sự tin cậy của khách hàng vào chất lượng của Quán nhỏ.</Text>
                <Text style={styles.item_value}>- Khi phát sinh tranh chấp, Chúng tôi đề cao giải pháp thương lượng, hòa giải giưa các bên nhằm duy trì sự tin cậy của khách hàng vào chất lượng của Quán nhỏ.</Text>
                <Text style={styles.item_value}>- Nếu hai bên không thể thương lượng với nhau và yêu cầu Quán nhỏ đứng ra giải quyết. Quyết định của Quán nhỏ là quyết định cuối cùng. Tranh chấp hoặc khiếu nại sẽ được Quán nhỏ xử lý theo trình tự sau:</Text>
                <Text style={styles.item_title_1}>Bước 1:</Text>
                <Text style={styles.item_value}>- Người mua gửi khiếu nại về hàng hóa của Nhà bán hàng qua 1 trong các kênh sau: </Text>
                <Text style={styles.item_value}>+ Email: quannho.cskh@gmail.com</Text>
                <Text style={styles.item_value}>+ Fanfages: Quán Nhỏ 82 CSKH</Text>
                <Text style={styles.item_title_1}>Bước 2:</Text>
                <Text style={styles.item_value}>- Bộ phận chăm sóc khách hàng sẽ tiếp nhận các khiếu nại của Người mua. Tùy theo tính chất và mức độ khiếu nại, Quán nhỏ sẽ có những biện pháp cụ thể để hỗ trợ Người mua giải quyết chanh trấp</Text>
                <Text style={styles.item_title_1}>Bước 3:</Text>
                <Text style={styles.item_value}>- Đối với trường hợp nằm ngoài khả năng xử lý của Quán nhỏ thì ban quản trị sẽ yêu cầu các bên đưa việc này ra cơ quan nhà nước có thẩm quyền để giải quyết theo pháp luật</Text>
                <Text style={styles.item_value}>- Khiếu nại phải có bằng chứng cụ thể rõ ràng, đồng thời phải có: </Text>
                <Text style={styles.item_value}>+ Thông tin tài khoản của Người khiếu nại</Text>
                <Text style={styles.item_value}>+ Chứng cứ liên quan,...</Text>
                <Text style={styles.item_value}>- Chúng tôi tôn trọng và nghiêm túc thực hiện các quy định của pháp luật về bảo về quyền lợi Người tiêu dùng. Vì vậy, đề nghị Nhà bán hàng đăng bán sản phẩm/dịch vụ trên sàn cung cấp đầy đủ, chính xác, trung thực, chi tiết các thông tin liên quan đến sản phẩm/dịch vụ. Mọi hành vi gian lận, lừa đảo trong kinh doanh đều bị lên án và phải chịu hoàn toàn mọi trách nhiệm trước pháp luật.</Text>
                <Text style={styles.item_value}>- Chúng tôi có trách nhiệm cung cấp các thông tin liên quan đến thành viên (mua hoặc bán) cho bên khiếu nại. Chúng tôi tích cực kết nối các bên để đàm phán, thỏa thuận các mâu thuẫn phát sinh trong quá trình giao dịch. Chúng tôi luôn sẵn sàng hỗ trợ các cơ quan nhà nước khi có yêu cầu liên quan đến các vụ việc trong giao dịch diễn ra trên sàn.</Text>
                <Text style={styles.item_value}>- Chúng tôi có trách nhiệm cung cấp các thông tin liên quan đến thành viên (mua hoặc bán) cho bên khiếu nại. Chúng tôi tích cực kết nối các bên để đàm phán, thỏa thuận các mâu thuẫn phát sinh trong quá trình giao dịch. Chúng tôi luôn sẵn sàng hỗ trợ các cơ quan nhà nước khi có yêu cầu liên quan đến các vụ việc trong giao dịch diễn ra trên sàn.</Text>
                <Text style={styles.item_value}>- Các bên (mua và bán) phỉa có vai trò trách nhiệm trong việc giải quyết tranh chấpm, khiếu nại. Đối với Nhà bán hàng cần có trách nhiệm cung cấp văn bản giấy tờ chứng thực liên quan đến sự việc đang gây mâu thuẫn cho Người mua. Đối với chúng tôi sẽ có trách nhiệm cung cấp những thông tin liên quan đến Người mua và Nhà bán hàng nếu được Người mua hoặc Nhà bán hàng (liên quan đến tranh chấp đó) yêu cầu.</Text>
                <Text style={styles.item_value}>- Sau khi Nhà bán hàng và Người mua giải quyết tranh chấp xong, phải có trách nhiệm báo lại cho ban quản trị Quán nhỏ. Trong trường hợp phát sinh lỗi do Nhà bán hàng , Chúng tôi sẽ có biện pháp cảnh cáo, hạn chế bán hàng hoặc chuyển cho cơ quan pháp luật có thẩm quyền tùy theo mức độ vi phạm. Chúng tôi sẽ xem xét chấm dứt và gỡ bỏ toàn bộ thông tin bài viết, sản phẩm/dịch vụ Nhà bán hàng trên ứng dụng. Đồng thời chúng tôi yêu cầu bồi hoàn cho Người mua thỏa đáng trên cơ sở thỏa thuận với Người mua.</Text>
                <Text style={styles.item_value}>- Chính sách có hiệu lực bắt đầu từ ngày ...</Text>

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
export default DrpScreen;