---
title: 'Developing a System for Vehicle Recognition and Counting'
excerpt: 'Hiện nay, quản lý lưu lượng giao thông là một thách thức lớn trong việc duy trì an ninh và hiệu suất của các khu vực đô thị và giao thông. Sự gia tăng nhanh chóng của số lượng xe cộ đưa ra một loạt các thách thức về việc đảm bảo an toàn, giảm ùn tắc giao  thông và tối ưu hóa quản lý lưu lượng xe giờ cao điểm.'
date: 2023-12-01
permalink: /products/2013/12/xay-dung-he-thong-dem-xe-o-to/
thumbnail: /images/research/xay-dung-he-thong-dem-xe-o-to/(18).jpg
pdf_link: /path-to-your-pdf.pdf
code_link: /path-to-your-code-repository
---

Hiện nay, quản lý lưu lượng giao thông là một thách thức lớn trong việc duy trì an ninh và hiệu suất của các khu vực đô thị và giao thông. Sự gia tăng nhanh chóng của số lượng xe cộ đưa ra một loạt các thách thức về việc đảm bảo an toàn, giảm ùn tắc giao  thông và tối ưu hóa quản lý lưu lượng xe giờ cao điểm. Dưới đây là 3 lợi ích dễ thấy nhất nếu phát triển bài toán này : 
- **An Toàn Giao Thông:** Cung cấp thông tin đầy đủ về lưu lượng giúp cải thiện an toàn giao thông bằng cách đảm bảo rằng tuyến đường không vượt quá sức chứa.
- **Dự Báo Ùn Tắc:** Hỗ trợ dự báo và quản lý ùn tắc giao thông thông qua việc theo dõi và phân tích dữ liệu lưu lượng.
- **Tối Ưu Hóa Hệ Thống Giao Thông:** Cho phép quản lý hiệu quả hơn thông qua cung cấp thông tin chi tiết về luồng lưu thông và thời gian giữa các điểm quan trọng.

# <span style="color: #226e93;">TÀI NGUYÊN</span>

Model sẽ được huấn luyện trên google colab và sử dụng chung bộ dataset về xe ô tô dưới nhiều góc camera bao gồm 1000 ảnh được gán nhãn. Data đều được thu thập trên google và được chia theo tỉ lệ 70% training, 20% validation, 10% testing, dưới đây là thông tin về card đồ họa NVIDIA được google colab cung cấp miễn phí:

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(1).png" width="70%" alt="Image"/>
</div>

**Giải thích:**
- Driver Version và CUDA Version:
- NVIDIA-SMI Driver Version: 525.105.17
- CUDA Version: 12.0
- Thông tin về GPU:
- Tên GPU: Tesla T4
- Nhiệt độ: 37°C
- Hiệu suất: P8
- Công suất: 11W / 70W

> **Bộ tài liệu:** [link drive](https://drive.google.com/file/d/1UDHgxFEDsvydjTTO5VTIYjNMekp1TNig/view?usp=sharing)
  
Dưới đây là một số hình ảnh được gán nhãn:

<div class="row-image">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(2).png" width="48%"/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(3).png" width="48%"/>
</div>

<br/>

Tập dữ liệu sẽ gồm 3 class:
- Xe Bus
- Xe ô tô con 
- Xe tải/ bán tải

Để mô hình được huấn luyện đạt hiệu quả tốt nhất thì sử dụng thêm 1 số kĩ thuật trong xử lý ảnh như lật ảnh, làm tối ảnh, thêm noise vào ảnh để làm giàu bộ dữ liệu cũng như tăng độ chính xác cho mô hình. Do tập dữ liệu đa số là ảnh ban ngày nên đã được làm tối ảnh, ngoài ra còn giúp phục vụ luôn cho việc có thể đếm xe vào ban đêm. Đây là ví dụ minh họa việc làm tối ảnh để phục vụ việc đếm cả khi trời tối: 

<div class="row-image">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(4).png" width="48%"/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(5).png" width="48%"/>
</div>

# <span style="color: #226e93;">MÔ HÌNH YOLO</span>

Loạt mô hình YOLO đã trở nên nổi tiếng trong lĩnh vực thị giác máy tính những năm gần đây. Sự nổi tiếng của YOLO là do độ chính xác đáng kể của nó trong khi vẫn duy trì kích thước mô hình tương đối nhỏ. Các mô hình YOLO ví dụ YOLOv3, YOLOv4, YOLOv5 có thể được đào tạo trên một GPU duy nhất giúp nhiều nhà phát triển có thể tiếp cận mô hình này. Những người thực hành học máy có thể triển khai nó với chi phí thấp trên phần cứng hoặc trên đám mây. Không những đạt hiệu xuất tốt phục vụ bài toán object detection mà nó còn độ chính xác cao, tốc độ nhanh ổn định. Với những ưu điểm đó, ưu tiên lựa chọn mô hình YOLOv8 mô hình mới ra vào năm 2023 đạt được nhiều sự quan tâm của cộng đồng bởi sự ưu việt mà nó đem lại. Dưới đây là một số lý do YOLOv8 được lựa chọn cho bài toán đếm xe: 
- YOLOv8 có độ chính xác cao hơn cả so với các mô hình trước đây (được đánh giá bằng COCO và Roboflow 100).
- YOLOv8 đi kèm với rất nhiều tính năng thuận tiện cho nhà phát triển, từ CLI dễ sử dụng đến gói Python được cấu trúc tốt.
- Có một cộng đồng lớn xung quanh YOLO và một cộng đồng đang phát triển xung quanh mô hình YOLOv8, nghĩa là có nhiều người trong giới thị giác máy tính có thể hỗ trợ khi cần hướng dẫn.

YOLOv8 đạt được độ chính xác cao trên COCO. Lấy ví dụ, phiên bản YOLOv8m chỉ là phiên bản kích cỡ trung bình nhưng cũng đạt được 50,2% mAP khi đánh giá trên COCO (so với YOLOv5m đạt 45,4% mAP). Khi được đánh giá trên Roboflow 100, YOLOv8 đạt điểm cao hơn đáng kể so với YOLOv5.

Dưới đây là kiến trúc của mô hình YOLOv8: 

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(6).png" width="70%" alt="Image"/>
</div>

### Anchor-Free Detection

Để hiểu về Anchor-Free Detection, chúng ta trước tiên cần hiểu về anchor boxes.

Anchor boxes giải quyết một vấn đề lớn trong phát hiện đối tượng. Trước khi có anchor boxes, một đối tượng được gán cho một ô lưới chứa điểm giữa của đối tượng đã cho. Nếu hai đối tượng có cùng điểm trung tâm, việc xây dựng hộp giới hạn và phân bổ chúng vào các lớp riêng lẻ trở nên rất phức tạp.

Ví dụ, xem xét tình huống trong đó một con người và một con ngựa có cùng điểm trung tâm ( hoặc cũng có thể hình dung ra hình ảnh xe bus và xe con có cùng điểm trung tập). Làm thế nào chúng ta nên xây dựng một hộp giới hạn trong trường hợp như vậy? 

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(7).png" width="70%" alt="Image"/>
</div>

Anchor boxes có thể được coi là các mẫu cookie-cutter. Xem xét trường hợp ta có hai anchor boxes: Anchor Box 1 và Anchor Box 2.

Bây giờ, ta sẽ kiểm tra trong danh sách các anchor boxes xem anchor boxes nào có chỉ số IoU cao nhất với hộp giới hạn thực tế và gán anchor boxes đó cho lớp tương ứng.

Như được minh họa dưới đây, anchor boxes 1 hữu ích cho các hình dáng ngang như ngựa, và anchor boxes 2 hữu ích cho các hình dáng dọc thẳng như con người.

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(8).png" width="70%" alt="Image"/>
</div>

Anchor box nói chung đã cải thiện quá trình huấn luyện bằng cách tăng mAP (mean Average Precision). Chúng đã được tích hợp vào các phiên bản YOLO trước đó. Tuy nhiên, trong YOLOv8, kiến trúc đã bỏ qua việc sử dụng Anchor box với một số lý do:
- Thiếu tính tổng quát: Huấn luyện với các Anchor box có sẵn làm cho mô hình trở nên cứng nhắc và khó phù hợp với dữ liệu mới.
- Không có Anchor box phù hợp trong tình huống không đều: Các tình huống không đều không thể được ánh xạ một cách rõ ràng bằng các Anchor box hình đa giác

### Kỹ thuật Tăng cường Dữ liệu Mosaic

Trong quá trình huấn luyện, YOLOv8 thực hiện nhiều kỹ thuật tăng cường cho ảnh huấn luyện. Một trong những kỹ thuật này là tăng cường dữ liệu mosaic.

Tăng cường dữ liệu mosaic là một kỹ thuật đơn giản, trong đó bốn hình ảnh khác nhau được nối lại với nhau và đưa vào mô hình như đầu vào. Điều này giúp mô hình học được các đối tượng thực sự từ các vị trí khác nhau và trong trạng thái bị che khuất.

<div class="row-image">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(9).png" width="48%"/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(10).png" width="48%"/>
</div>

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(11).png" width="70%" alt="Image"/>
</div>

### Cải tiến về số lượng tham số

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(12).png" width="70%" alt="Image"/>
</div>

Như chúng ta có thể thấy từ biểu đồ, YOLOv8 có nhiều tham số hơn so với các phiên bản tiền nhiệm như YOLOv5, nhưng ít tham số hơn so với YOLOv6. Nó cung cấp khoảng 33% mAP nhiều hơn cho các mô hình kích thước n và mAP lớn hơn nói chung.

Từ biểu đồ thứ hai, chúng ta có thể thấy YOLOv8 có thời gian suy luận nhanh hơn so với tất cả các phiên bản YOLO khác.

# <span style="color: #226e93;">HUẤN LUYỆN </span>

- 100 epochs, image size là : 640x640 
- Chi tiết quá trình training: [link drive](https://drive.google.com/file/d/1lk7Jgj4qJa5C6gsnNfitvBrSYV8pen5S/view?usp=sharing)
- Pretrain: là model trước đó đã được huấn luyện nhưng chỉ detect 1 class car, việc sử dụng model đấy làm pretrain khiến model cho kết quả khá tốt ở những giai đoạn đầu của quá trình huấn luyện.

### Kết Quả

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(13).png" width="70%" alt="Image"/>
</div>

### Tổng Kết Hiệu Suất của Mô Hình

**Tổng quan (ALL):**
- mAP50 (Mean Average Precision at IoU 0.5): 95.7%
- mAP50-95 (Mean Average Precision from IoU 0.5 to 0.95): 81.7%

> *Nhận xét:* <br/>
> Mô hình đã đạt được một mức độ chính xác đáng kể trên toàn bộ các lớp đối tượng, với mAP50 là 95.7% và mAP50-95 là 81.7%. Điều này chỉ ra rằng mô hình có khả năng đối phó tốt cả trong việc nhận diện các đối tượng lớn và nhỏ.


**Bus:**
- mAP50: 95.68%
- mAP50-95: 83.7%

> *Nhận xét:* <br/>
> Mô hình có hiệu suất rất tốt trong việc nhận diện Bus, với mAP50 đạt 95.68% và mAP50-95 là 83.7%. Điều này chứng minh khả năng của mô hình trong việc phân loại và định vị Bus.


**Truck:**
- mAP50: 96.48%
- mAP50-95: 79.2%
> *Nhận xét:* <br/>
> Mô hình cũng đạt được kết quả ấn tượng với lớp Truck, với mAP50 là 96.48%. Mặc dù mAP50-95 giảm xuống, nhưng vẫn cho thấy khả năng của mô hình trong việc nhận diện các đối tượng Truck.


**Car:**
- mAP50: 95.6%
- mAP50-95: 82.1%
> *Nhận xét:* <br/>
> Mô hình hiển thị sự chính xác cao trong việc phân loại và định vị Car, với mAP50 là 95.6% và mAP50-95 là 82.1%.

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(14).png" width="70%" alt="Image"/>
</div>

Từ bảng confusion matrix em có một số nhận xét như sau:

**Class bus:**
- Chính xác (True Positive - TP): 94%
- Sai sót loại 1 (False Negative - FN): 6%
- Sai sót loại 2 (False Positive - FP): 0%
- Chính xác khi phân loại không phải Bus (True Negative - TN): 100%

> *Nhận xét:* <br/>
> Mô hình có hiệu suất rất cao trong việc nhận diện Bus, với tỷ lệ True Positive lên đến 94%. Chỉ có một số ít lỗi nhỏ khi phân loại thành phần khác là Bus (False Negative chiếm 6%).


**Class truck:**
- Chính xác (True Positive - TP): 91%
- Sai sót loại 1 (False Negative - FN): 9%
- Sai sót loại 2 (False Positive - FP): 3%
- Chính xác khi phân loại không phải Truck (True Negative - TN): 48%

> *Nhận xét:* <br/>
> Mô hình có hiệu suất tốt trong việc nhận diện Truck, với tỷ lệ True Positive là 91%. Tuy nhiên, cũng có một số lỗi nhỏ khi phân loại thành phần khác là Truck (False Negative chiếm 9%, False Positive chiếm 3%).


**Class car:**
- Chính xác (True Positive - TP): 92%
- Sai sót loại 1 (False Negative - FN): 8%
- Sai sót loại 2 (False Positive - FP): 7%
- Chính xác khi phân loại không phải Car (True Negative - TN): 46%

> *Nhận xét:* <br/>
> Mô hình đạt được kết quả khá tốt trong việc nhận diện Car, với tỷ lệ True Positive là 92%. Tuy nhiên, cũng có một số lỗi khi phân loại thành phần khác là Car (False Negative chiếm 8%, False Positive chiếm 7%).


**Class background:**
- Chính xác (True Negative - TN): 100%
- Sai sót loại 1 (False Positive - FP): 2%
- Sai sót loại 2 (False Negative - FN): 2%
- Chính xác khi phân loại không phải Background (True Positive - TP): 96%

> *Nhận xét:* <br/>
> Mô hình có khả năng đặc biệt cao trong việc phân loại đúng là Background, với tỷ lệ True Negative lên đến 100%. Tuy nhiên, cũng có một số ít lỗi khi phân loại thành phần khác là Background (False Positive chiếm 2%, False Negative chiếm 2%).

**Biểu đồ trực quan về Presion, Recall, F1-score:**

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(15).png" width="70%" alt="Image"/>
  <br/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(16).png" width="70%" alt="Image"/>
</div>


# <span style="color: #226e93;">MỘT SỐ KẾT QUẢ CHẠY THỰC TẾ</span>

<div align="center">
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(17).png" width="70%" alt="Image"/>
  <br/>
  <br/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(18).jpg" width="70%" alt="Image"/>
  <br/>
  <br/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(19).png" width="70%" alt="Image"/>
  <br/>
  <br/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(20).jpg" width="70%" alt="Image"/>
  <br/>
  <br/>
  <img src="/images/research/xay-dung-he-thong-dem-xe-o-to/(21).jpg" width="70%" alt="Image"/>
  <br/>
</div>

