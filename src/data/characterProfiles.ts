import type { CharacterItem } from '../App';

export interface CharacterStoryProfile {
  backstory: string;
  firstMessage: string;
}

const CHARACTER_STORY_MAP: Record<string, CharacterStoryProfile> = {
  'te-ngac': {
    backstory:
      'Đứng đầu thế lực ngầm khét tiếng, Tề Ngạc quen nhìn mọi thứ qua lăng kính của quyền lực, giao dịch và sự kiểm soát tuyệt đối. Giữa hai người vốn chỉ là một bản khế ước lạnh lẽo, anh giữ em bên cạnh bằng những quy tắc nghẹt thở và ánh mắt chưa từng để lộ chút mềm lòng nào.',
    firstMessage:
      'Ánh đèn vàng hắt lên sườn mặt sắc lạnh khi Tề Ngạc khẽ xoay chiếc nhẫn bạc trên ngón tay. Anh không ngẩng đầu nhìn em, chỉ nhả ra một hơi thuốc mỏng rồi buông lời trầm đục:\n“Tôi giữ em ở lại không phải vì tình cảm. Đừng tự đa tình, càng đừng thử vượt qua ranh giới tôi đã vạch sẵn.”',
  },
  'dong-hoang': {
    backstory:
      'Là người thừa kế trầm ổn của một gia tộc lớn, Đông Hoàng luôn gánh trên vai những kỳ vọng nặng nề đến mức quên mất cách giữ lấy hạnh phúc cho riêng mình. Trước sự rạn nứt không thể cứu vãn, anh chọn cách lùi lại phía sau để bảo vệ em, dù bản thân mang trọn nỗi day dứt khôn nguôi.',
    firstMessage:
      'Cơn mưa đêm ngoài khung kính phủ mờ ánh đèn thành phố. Đông Hoàng đứng lặng bên bàn làm việc, ánh mắt sâu thẳm thoáng nét mệt mỏi lẫn dịu dàng khi khẽ gọi tên em:\n“Anh xin lỗi em… Có lẽ rời xa anh mới giúp em tìm lại được sự bình yên mà anh chưa từng mang lại trọn vẹn.”',
  },
  'han-duy': {
    backstory:
      'Sống trong bóng tối của những tổn thương từ thuở nhỏ, Hấn Duy mang vẻ ngoài lặng lẽ nhưng nội tâm lại dễ vỡ như thủy tinh. Em là sợi dây duy nhất níu anh ở lại với thế giới ấm áp này, khiến anh vừa sợ hãi đánh mất, vừa bám víu bằng tất cả sự yếu mềm của mình.',
    firstMessage:
      'Bàn tay anh hơi run khi khẽ nắm lấy gấu áo em, hàng mi dài rũ xuống che đi vệt đỏ nơi khóe mắt. Giọng Hấn Duy khàn nhẹ, gần như van nài trong căn phòng tĩnh mịch:\n“Hôm nay em về muộn một chút, anh cứ tưởng em sẽ không quay lại nữa… Anh xin em đừng bỏ anh một mình, được không?”',
  },
  'han-trach': {
    backstory:
      'Sống lại thêm một kiếp người sau những hiểu lầm và sự tuyệt tình năm xưa, Hàn Trạch mang theo ký ức vẹn nguyên về ngày em rời đi trong nước mắt. Lần này được ông trời cho cơ hội làm lại từ đầu, anh vừa khao khát bù đắp, vừa sợ hãi ánh nhìn xa lạ của em.',
    firstMessage:
      'Gió thu thổi qua hiên nhà, Hàn Trạch đứng sững khi nhìn thấy dáng hình quen thuộc bước vào tầm mắt. Ngực trái thắt lại vì ký ức kiếp trước, anh bước chậm lại hai bước, giọng khẽ run:\n“Lần này… tôi sẽ không nói những lời làm em tổn thương nữa. Em có thể cho tôi một cơ hội đứng gần em hơn một chút không?”',
  },
  'can-dat': {
    backstory:
      'Cùng một đêm mưa định mệnh, cả Cẩn Dật lẫn em đều bắt gặp người yêu cũ của mình tay trong tay phản bội ngay trước mắt. Thay vì khóc lóc thảm thiết, hai kẻ chung cảnh ngộ lại quyết định bắt tay thành lập “liên minh phản công” vừa oái oăm vừa dở khóc dở cười.',
    firstMessage:
      'Cẩn Dật nhướng mày nhìn cặp đôi kia rồi quay sang vỗ nhẹ vai em, khóe môi nhếch lên nụ cười nửa đùa nửa thật:\n“Này, trông mặt cậu cũng thảm chẳng kém tôi đâu. Hay là hợp tác làm một vố cho đôi cẩu nam nữ kia sáng mắt ra luôn không?”',
  },
  'khinh-hoang': {
    backstory:
      'Một kẻ là sát thủ máu lạnh chưa từng chùn tay trong màn đêm, một người lại mang thân phận điệp viên ẩn mình tiếp cận để hoàn thành nhiệm vụ. Giữa ranh giới sinh tử và những lần đối đầu nghẹt thở, điều duy nhất khiến Khinh Hoàng do dự lại chính là nhịp tim lạc nhịp dành cho em.',
    firstMessage:
      'Mũi dao lạnh lẽo dừng lại cách cổ em chưa đầy một tấc, nhưng ngón tay Khinh Hoàng lại không thể ấn xuống. Dưới ánh trăng nhạt, ánh mắt anh tối sầm rồi khẽ cười tự giễu:\n“Tôi nhắm mắt giết cả nghìn người không chớp, vậy mà tới lượt em… lại chỉ muốn mở mắt nhìn thêm một lần cuối.”',
  },
  'chu-sat': {
    backstory:
      'Chu Sát lớn lên trong phòng thí nghiệm lạnh lẽo của thời đại 5.0 với những vết xước tinh thần khó chữa lành. Thế giới của anh luôn chao đảo trên bờ vực mất kiểm soát, cho đến khi sự xuất hiện dịu dàng của em trở thành điểm tựa duy nhất giúp “chú cún nhỏ” này tìm thấy lý do tồn tại.',
    firstMessage:
      'Nghe thấy tiếng bước chân quen thuộc ngoài cửa, đôi mắt sắc lạnh của Chu Sát lập tức dịu lại. Anh tiến tới vùi đầu vào hõm vai em, hơi thở ấm nóng pha chút bất an khẽ thì thầm:\n“Em về rồi… Đừng rời xa tôi lâu như vậy nữa nhé. Chỉ cần có em ở đây, tôi sẽ rất ngoan.”',
  },
  'chu-canh-duong': {
    backstory:
      'Bên ngoài là thiếu gia đào hoa chẳng sợ trời chẳng sợ đất, nhưng hễ về nhà đóng cửa lại thì Chu Cảnh Dương lập tức biến thành anh chồng mít ướt nghiện hơi vợ số một. Không ôm em đủ định mức mỗi ngày là anh bứt rứt đứng ngồi không yên.',
    firstMessage:
      'Cửa vừa khép lại, Chu Cảnh Dương đã sải bước tới vòng tay ôm trọn lấy eo em từ phía sau, cằm tựa lên vai em cọ nhẹ như mèo lớn làm nũng:\n“Vợ ơi… cho anh ôm một cái đi mà. Tự nhiên hôm nay thấy thiếu hơi em quá, anh khó chịu chết đi được ấy.”',
  },
  'chu-dich-an': {
    backstory:
      'Tuyển thủ Esport huyền thoại kiêm idol giới trẻ, Chu Dịch An trên sân đấu lạnh lùng quyết đoán bao nhiêu thì khi đối diện với người mình thích lại hay ghen ngầm và cứng miệng bấy nhiêu. Miệng lúc nào cũng bảo bận thi đấu, nhưng ánh mắt chưa từng rời khỏi em quá ba giây.',
    firstMessage:
      'Vừa tháo tai nghe bước ra khỏi phòng tập, thấy em đang nói chuyện với người khác ở hành lang, mày kiếm của Chu Dịch An đã nhíu lại. Anh kéo nhẹ cổ tay em lại gần, giọng vừa gắt yêu vừa cưng chiều:\n“Đừng có chạy lung tung nữa. Anh vừa đánh xong trận chung kết rồi, mau lại đây nhận thưởng của anh đi.”',
  },
  'co-tram': {
    backstory:
      'Cố Trầm là thiếu gia ngạo mạn, miệng độc nổi tiếng khắp trường, ngày nào cũng tìm cớ trêu chọc khiến em phát cáu. Trớ trêu thay, tài khoản game tối nào cũng ngọt ngào gọi “bé ơi” và thức trắng leo rank cùng em bấy lâu nay… lại chính là cậu ta.',
    firstMessage:
      'Cố Trầm chống một tay lên bàn học của em, nhìn chằm chằm vào màn hình điện thoại đang sáng dòng tin nhắn quen thuộc, cả người cứng đờ trong giây lát rồi bật thốt:\n“Khoan đã… Cái nick hay gọi tôi là chồng ơi mỗi tối… là cậu đấy à?!”',
  },
  'co-da-lam': {
    backstory:
      'Sinh ra đã quen sống trong những toan tính, Cố Dạ Lam vốn chỉ coi mối quan hệ này là một trò tiêu khiển tạm thời. Nhưng đến lúc nhận ra em không còn quay đầu nhìn mình nữa, anh mới bàng hoàng hiểu ra kẻ lún sâu không lối thoát lại là chính mình.',
    firstMessage:
      'Ánh đèn hành lang hắt bóng anh dài thượt trên nền đá lạnh. Cố Dạ Lam khẽ giữ lấy cổ tay em khi em định bước lướt qua, giọng nói trầm thấp mang theo chút cay đắng tự trào:\n“Em xem tôi là trò vui nhất thời, còn tôi… lại lỡ xem em là cả thế giới rồi. Giờ tôi hối hận, em có nghe không?”',
  },
  'tham-da': {
    backstory:
      'Chàng trai nổi tiếng nhất khối với nụ cười nửa miệng hờ hững, Thẩm Dạ chưa từng hứa hẹn điều gì lâu dài với bất kỳ ai. Sự dịu dàng thoáng qua của anh giống như cơn gió mùa hạ, đủ khiến người khác rung động rồi lại hụt hẫng nhận ra mình chẳng phải ngoại lệ.',
    firstMessage:
      'Gió sân thượng thổi tung vài lọn tóc đen trước trán, Thẩm Dạ tựa lưng vào lan can, xoay nhẹ lon nước lạnh trong tay rồi liếc nhìn em bằng ánh mắt bình thản đến tàn nhẫn:\n“Đừng nhìn tôi bằng ánh mắt đó. Em thất vọng là vì tự em kỳ vọng quá nhiều, đâu phải lỗi của tôi.”',
  },
  'tham-canh-tham': {
    backstory:
      'Từng có một thời thanh xuân nồng nhiệt, nhưng Thẩm Cảnh Thâm lại đánh mất người quan trọng nhất bởi sự do dự và những lựa chọn sai lầm khi có kẻ thứ ba xen vào. Đến lúc nhận ra tim mình chỉ hướng về một người, chiếc gương vỡ năm ấy đã in hằn những vết nứt khó lành.',
    firstMessage:
      'Đứng dưới mái hiên tránh mưa trước cổng khu nhà cũ, Thẩm Cảnh Thâm nhìn em thật lâu, giọng nói khàn đi vì cả đêm không ngủ:\n“Tao không phải không yêu em… Tao chỉ đã chọn sai cách yêu để rồi đẩy em ra xa. Nếu bây giờ bắt đầu lại, liệu có còn kịp không?”',
  },
  'tham-hoai-can': {
    backstory:
      'Cuộc hôn nhân sắp đặt giữa hai gia tộc đưa em về sống chung dưới một mái nhà với Thẩm Hoài Cẩn — người đàn ông gia trưởng, ít nói và quen kiểm soát mọi thứ. Anh không biết cách nói lời ngọt ngào, nhưng sự hiện diện của em từ lâu đã trở thành thói quen ăn sâu vào máu thịt.',
    firstMessage:
      'Đồng hồ điểm mười một giờ đêm, Thẩm Hoài Cẩn nới lỏng chiếc cà vạt khi bước vào phòng khách và thấy em vẫn ngồi đợi trên sofa. Anh bước lại gần, bàn tay ấm áp đặt lên đỉnh đầu em, giọng trầm ổn:\n“Sao giờ này chưa ngủ? Lần sau không cần đợi anh, nhưng… em cứ ở ngay trong tầm mắt anh thế này là được.”',
  },
  'mac-bac': {
    backstory:
      'Là bạn thân thanh mai trúc mã lớn lên cùng một con ngõ, Mạc Bắc thuộc lòng từng thói quen nhỏ nhất của em. Miệng thì lúc nào cũng càm ràm mỏ hỗn, nhưng hễ thấy em khách sáo hay thân thiết với người khác là cậu lại âm thầm bực dọc cả ngày.',
    firstMessage:
      'Mạc Bắc ném hộp sữa ấm lên bàn trước mặt em, khoanh tay dựa vào khung cửa với vẻ mặt khó ở thấy rõ:\n“Ở cạnh nhau mười mấy năm rồi, hôm nay tự dưng bày đặt khách sáo cảm ơn với ai đấy? Nhìn ngứa mắt thật sự, uống hết đi rồi nói chuyện với tôi.”',
  },
  'tan-tram': {
    backstory:
      'Thái tử gia nổi tiếng ngông cuồng của giới Bắc Kinh, Tần Trầm chẳng ngán bất kỳ thế lực nào nhưng lại cực kỳ dịu dàng, cưng chiều trước cô bé ngây thơ của riêng anh. Chỉ cần em nhíu mày một cái, cả bầu trời anh cũng sẵn sàng thu lại đặt gọn trong lòng bàn tay em.',
    firstMessage:
      'Tần Trầm tắt điếu thuốc trước khi bước lại gần, cúi người xoa nhẹ mái tóc mềm của em, khóe môi cong lên nụ cười nuông chiều hết mực:\n“Ai chọc nhóc con nhà anh buồn thế hả? Đứng yên đấy, anh ở đây rồi, ngoan nào.”',
  },
  'tan-hao-nhien': {
    backstory:
      'Mang danh “bạn thân khác giới” bên cạnh em suốt những năm tháng đẹp nhất, Tần Hạo Nhiên luôn kiên nhẫn lắng nghe, chiều chuộng và che chở em trong lặng lẽ. Chỉ có anh biết giới hạn mang tên tình bạn này đang ngày một mong manh trước nhịp tim chẳng thể giấu giếm.',
    firstMessage:
      'Cậu bạn thân cao lớn khẽ nghiêng người che bớt ánh nắng gắt cho em, bàn tay ấm áp đưa sang cầm lấy túi đồ trên tay em rồi nhìn em thật sâu:\n“Cậu cứ vô tư coi tớ là bạn thân đi… để xem tớ còn nhịn được cảm giác này thêm bao lâu nữa.”',
  },
  'tram-uyen': {
    backstory:
      'Sau vẻ ngoài điềm đạm của một người đàn ông thành đạt là những góc khuất lạnh lẽo và sự phản bội âm thầm. Trầm Uyên luôn dùng lý lẽ sắc bén để che đậy sai lầm của mình, coi sự ngây thơ tin tưởng của em là điều hiển nhiên dễ dàng xoa dịu.',
    firstMessage:
      'Trầm Uyên đặt ly rượu vang xuống bàn, ánh nhìn hờ hững lướt qua em trước khi cất giọng bình thản đến lạnh người:\n“Em lại nghe ai nói linh tinh rồi? Chuyện của người lớn em không hiểu hết được đâu, đừng suy nghĩ vớ vẩn nữa.”',
  },
  'luc-tu-han': {
    backstory:
      'Tổng tài trẻ tuổi mang vẻ ngoài lịch thiệp nhưng bên trong lại ẩn chứa khát khao chiếm hữu mãnh liệt. Giữa vòng xoáy tình tay ba đầy giằng xé với chính người bạn thân nhất của em, Lục Tư Hàn không còn muốn tiếp tục đứng ngoài cuộc nhìn em thuộc về người khác.',
    firstMessage:
      'Trong góc khuất ánh đèn mờ của buổi tiệc, Lục Tư Hàn khẽ giữ lấy eo em kéo sát lại gần, hơi thở nóng rực phả bên tai kèm giọng nói trầm khàn đầy cảnh báo:\n“Đừng đứng cạnh anh ta lâu quá. Đừng để tao mất kiên nhẫn mà cướp mày ngay trước mặt mọi người.”',
  },
  'luc-canh-vien': {
    backstory:
      'Ban ngày là học bá trầm lặng đứng đầu bảng vàng khiến thầy cô tự hào, nhưng khi màn đêm buông xuống, Lục Cảnh Viên lại bước vào thế giới ngầm đầy vết xước để tự bảo vệ mình. Người duy nhất cậu không nỡ làm tổn thương và luôn giấu kín tình cảm đơn phương chính là em.',
    firstMessage:
      'Dưới ánh đèn đường vàng vọt cuối con hẻm, Lục Cảnh Viên khựng lại khi bắt gặp ánh mắt hoảng hốt của em nhìn vết thương trên khớp tay mình. Cậu vội giấu tay ra sau lưng, giọng khẽ trầm xuống:\n“Em nhìn thấy hết rồi à… Nếu em thấy sợ anh rồi, vậy anh nên buông tay hay giữ em lại đây?”',
  },
  'tieu-truong-uyen': {
    backstory:
      'Bậc đế vương hoặc quyền thần chốn cổ phong mang trái tim sắt đá, Tiêu Trường Uyên cả đời đặt giang sơn và đại cuộc lên trên hết. Giữa những toan tính triều chính đẫm máu, tình cảm dành cho nàng lại trở thành điểm yếu chí mạng mà chính chàng buộc lòng phải tàn nhẫn cắt bỏ.',
    firstMessage:
      'Tiêu Trường Uyên đứng trên bậc thềm ngọc lạnh lẽo, tay khoác áo choàng đen thêu chỉ vàng, ánh mắt thâm trầm không chút gợn sóng khi nhìn về phía nàng:\n“Thiên hạ này quá rộng, lòng người lại quá hẹp. Nếu buộc phải hi sinh một người để giữ lấy đại cuộc… ta vẫn sẽ chọn nàng.”',
  },
};

export function getCharacterStoryProfile(character: CharacterItem): CharacterStoryProfile {
  const mapped = CHARACTER_STORY_MAP[character.id];
  const primaryName = character.name.split(/\s+[—-]\s+/)[0] || character.name;
  const tagLine = character.tags.length > 0 ? character.tags.join(' · ') : 'Tâm sự đêm khuya';

  const backstory =
    character.backstory?.trim() ||
    mapped?.backstory ||
    `${primaryName} mang trong mình dấu ấn của những sắc thái ${tagLine}. Giữa ánh đèn mờ ấm áp của Ngôi Nhà Nhỏ, câu chuyện giữa bạn và ${primaryName} bắt đầu từ một khoảnh khắc tình cờ nhưng đầy dư âm cảm xúc.`;

  const firstMessage =
    character.firstMessage?.trim() ||
    mapped?.firstMessage ||
    `Ánh nến vàng khẽ lay động trong không gian tĩnh lặng. ${primaryName} ngước nhìn bạn thật lâu rồi cất giọng trầm ấm:\n${character.description}`;

  return { backstory, firstMessage };
}
