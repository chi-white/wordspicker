-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: kimdb.clhgz7gmuaob.ap-southeast-2.rds.amazonaws.com    Database: wordspicker
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'test'),(2,'toefl');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chapter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` int NOT NULL,
  `chapter` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Chapter_FK` (`category`),
  CONSTRAINT `Chapter_FK` FOREIGN KEY (`category`) REFERENCES `Category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chapter`
--

LOCK TABLES `Chapter` WRITE;
/*!40000 ALTER TABLE `Chapter` DISABLE KEYS */;
INSERT INTO `Chapter` VALUES (1,1,1),(2,2,1),(3,2,2),(4,2,3);
/*!40000 ALTER TABLE `Chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Favorite`
--

DROP TABLE IF EXISTS `Favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Favorite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `wordid` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Favorite_UN` (`userid`,`wordid`),
  KEY `Favorite_FK_1` (`wordid`),
  CONSTRAINT `Favorite_FK` FOREIGN KEY (`userid`) REFERENCES `User` (`id`),
  CONSTRAINT `Favorite_FK_1` FOREIGN KEY (`wordid`) REFERENCES `Word` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=562 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Favorite`
--

LOCK TABLES `Favorite` WRITE;
/*!40000 ALTER TABLE `Favorite` DISABLE KEYS */;
INSERT INTO `Favorite` VALUES (522,2,5),(557,5,3),(560,12,3),(561,12,4);
/*!40000 ALTER TABLE `Favorite` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `main_html` tinyint(1) NOT NULL,
  `doublegame_html` tinyint(1) NOT NULL,
  `role` varchar(100) NOT NULL,
  `practicemode_html` tinyint(1) NOT NULL,
  `testmode_html` tinyint(1) NOT NULL,
  `add_words` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,1,1,'user',1,1,0),(2,1,1,'admin',1,1,1);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TestResult`
--

DROP TABLE IF EXISTS `TestResult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TestResult` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `category` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `chapter` int NOT NULL,
  `score` int NOT NULL,
  `time` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TestResult`
--

LOCK TABLES `TestResult` WRITE;
/*!40000 ALTER TABLE `TestResult` DISABLE KEYS */;
INSERT INTO `TestResult` VALUES (1,2,'test',1,100,'2023-12-14 17:13:57'),(2,2,'test',1,75,'2023-12-14 17:17:31'),(3,1,'test',1,100,'2023-12-15 01:31:47'),(4,1,'test',1,100,'2023-12-15 01:46:37'),(5,1,'test',1,50,'2023-12-15 04:56:13'),(6,1,'test',1,55,'2023-12-15 04:57:31'),(7,1,'test',1,75,'2023-12-15 06:11:27'),(8,1,'test',1,75,'2023-12-15 06:16:25'),(9,1,'test',1,100,'2023-12-15 07:35:16'),(10,1,'test',1,100,'2023-12-15 07:36:35'),(11,1,'test',1,50,'2023-12-15 07:51:29'),(12,1,'test',1,30,'2023-12-15 07:55:48'),(13,1,'test',1,75,'2024-06-23 13:45:13'),(14,1,'toefl',3,0,'2024-07-05 06:34:58'),(15,1,'toefl',3,120,'2024-07-05 06:43:10'),(16,1,'toefl',2,90,'2024-07-05 06:55:06'),(17,1,'toefl',2,205,'2024-07-05 06:57:23'),(18,1,'toefl',2,89,'2024-07-05 07:40:14'),(19,17,'test',1,50,'2024-07-08 07:56:43'),(20,17,'test',1,100,'2024-07-08 07:58:59'),(21,17,'test',1,75,'2024-07-08 07:59:17'),(22,17,'test',1,0,'2024-07-08 09:03:22'),(23,17,'test',1,0,'2024-07-08 09:05:51'),(24,17,'test',1,0,'2024-07-08 09:06:53'),(25,17,'test',1,0,'2024-07-08 09:07:29'),(26,17,'test',1,0,'2024-07-08 09:12:12'),(27,17,'test',1,0,'2024-07-08 09:13:00'),(28,17,'test',1,0,'2024-07-08 09:13:45'),(29,17,'test',1,0,'2024-07-08 09:15:14'),(30,17,'test',1,0,'2024-07-08 09:18:50'),(31,17,'test',1,0,'2024-07-08 09:19:40'),(32,17,'test',1,75,'2024-07-08 09:22:00'),(33,17,'test',1,100,'2024-07-08 09:27:37'),(34,17,'test',1,75,'2024-07-08 09:28:41'),(35,17,'test',1,100,'2024-07-08 09:29:05'),(36,17,'test',1,100,'2024-07-08 09:34:51'),(37,17,'test',1,100,'2024-07-08 09:36:14'),(38,17,'test',1,100,'2024-07-08 09:37:08'),(39,17,'test',1,75,'2024-07-08 09:37:32'),(40,17,'test',1,100,'2024-07-08 09:37:49'),(41,17,'test',1,100,'2024-07-08 11:31:38'),(42,17,'test',1,75,'2024-07-08 11:32:02'),(43,17,'test',1,0,'2024-07-08 11:43:38'),(44,17,'test',1,25,'2024-07-08 11:51:46'),(45,17,'test',1,100,'2024-07-08 13:06:38'),(46,17,'test',1,100,'2024-07-08 13:35:27'),(47,17,'test',1,100,'2024-07-08 13:35:46'),(48,17,'test',1,100,'2024-07-08 14:00:15'),(49,17,'test',1,75,'2024-07-10 11:22:25'),(50,17,'test',1,100,'2024-07-10 11:24:11'),(51,17,'test',1,100,'2024-07-10 11:30:13'),(52,17,'test',1,75,'2024-07-10 11:31:47'),(53,17,'test',1,55,'2024-07-10 11:43:34'),(54,17,'test',1,100,'2024-07-10 11:44:03'),(55,17,'test',1,10,'2024-07-10 18:49:12'),(56,17,'test',1,100,'2024-07-10 18:50:31'),(57,17,'test',1,100,'2024-07-10 18:50:50'),(58,17,'test',1,75,'2024-07-10 18:54:46'),(59,17,'test',1,55,'2024-07-10 19:13:06'),(60,17,'test',1,75,'2024-07-10 19:14:02'),(61,17,'test',1,100,'2024-07-10 19:14:19'),(62,17,'test',1,100,'2024-07-10 19:14:36'),(63,17,'test',1,100,'2024-07-11 03:18:13'),(64,17,'test',1,100,'2024-07-11 03:19:45'),(65,17,'test',1,100,'2024-07-11 03:37:11'),(66,17,'test',1,100,'2024-07-11 03:40:49'),(67,17,'test',1,75,'2024-07-11 03:41:25'),(68,17,'test',1,100,'2024-07-11 03:42:12'),(69,17,'toefl',1,44,'2024-07-11 03:57:59'),(70,17,'toefl',1,91,'2024-07-11 05:23:11'),(71,17,'toefl',3,60,'2024-07-11 05:32:18'),(72,17,'test',1,100,'2024-07-11 05:42:41');
/*!40000 ALTER TABLE `TestResult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `provider` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'native',
  `role` varchar(100) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'king','king@gmail.com','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','native','user'),(2,'king1','king1@gmail.com','154c4c511cbb166a317c247a839e46cac6d9208af5b015e1867a84cd9a56007b','native','user'),(3,'king2','king2@gmail.com','eef30647d28ea37791c73e9ee10e982ee0eebf8f13cd29b144f5f1c4d8ef7596','native','user'),(4,'king3','king3@gmail.com','bc4ef546e7af95f1ea7e88338fca4a865a0db737104fb5bdc9ce166c4bf22df2','native','user'),(5,'chi square','king0209king0209@gmail.com',NULL,'google','admin'),(9,'白樂祺','king0209.dif08@nctu.edu.tw',NULL,'google','user'),(10,'king5','king99@gmail.com','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','native','user'),(11,'king99','king999@gmail.com','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','native','user'),(12,'noriko','noriko.bears.jp@gmail.com','7ebfb4661cd94e1522f940ae030421c6be3f69966ae96bb6148b5de4fbcd093f','native','user'),(13,'testhaha','testhaha@gmail.com','888da5db853449fff82b07cbdbf7c755ece0783aa670bb36cc5c4cc9a68fb864','native','user'),(14,'paul','test@gmail.com','15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225','native','user'),(15,'king','king8787@gmail.com','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','native','user'),(16,'hahaokok','king@gg.com','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','native','user'),(17,'a','a@aaa.com','961b6dd3ede3cb8ecbaacbd68de040cd78eb2ed5889130cceb4c49268ea4d506','native','user'),(18,'ss','s@s.com','043a718774c572bd8a25adbeb1bfcd5c0256ae11cecf9f9c3f925d0e52beaf89','native','user'),(19,'qq','q@q.com','8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf','native','user'),(20,'qq','qq@d.com','d5ce2b19fbda14a25deac948154722f33efd37b369a32be8f03ec2be8ef7d3a5','native','user'),(21,'3','1@3.com','4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8','native','user'),(22,'jj','j@g.com','597c28c381ef1feee61f3e9677a628b4cbd41cfb2539c8938062e1df2a882d39','native','user'),(23,'r','r@r.com','454349e422f05297191ead13e21d3db520e5abef52055e4964b82fb213f593a1','native','user');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Word`
--

DROP TABLE IF EXISTS `Word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Word` (
  `id` int NOT NULL AUTO_INCREMENT,
  `english` varchar(100) NOT NULL,
  `chinese` varchar(100) NOT NULL,
  `abbreviation` varchar(100) NOT NULL,
  `example` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `voice` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `category` int NOT NULL,
  `chapter` int DEFAULT NULL,
  `related` varchar(100) DEFAULT NULL,
  `example_chinese` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Word_FK` (`category`),
  CONSTRAINT `Word_FK` FOREIGN KEY (`category`) REFERENCES `Category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Word`
--

LOCK TABLES `Word` WRITE;
/*!40000 ALTER TABLE `Word` DISABLE KEYS */;
INSERT INTO `Word` VALUES (1,'apple','蘋果','n','An apple a day keeps the doctor away.','1',1,1,'','一天一蘋果，醫生遠離我。\r\n'),(2,'pig','豬','n','The pig wallowed in the muddy pen.','1',1,1,'Sus scrofa domestica','豬在泥濘的圈子裡打滾。'),(3,'accomplishment','成就；完成','n','Winning the Nobel Prize was an accomplishment that changed her life.','1',2,1,'achievement, success','獲得諾貝爾獎是改變她生活的成就。'),(4,'acronym','首字母縮寫詞','n','NASA is an acronym for the National Aeronautics and Space Administration.','1',2,1,'abbreviation, initialism','NASA是國家航空航天局的首字母縮寫。'),(5,'acute','極度的；劇烈的；敏銳的；嚴重的','adj','His acute sense of hearing caught every whisper in the room.','1',2,1,'sharp, intense','他敏銳的聽覺捕捉到房間裡的每一個耳語。'),(6,'adhere','黏附；堅持','v','The poster will adhere to the wall if you use enough glue.','1',2,1,'stick, bond','如果你使用足夠的膠水，海報將會粘在牆上'),(7,'agression','侵略','n','His sudden outburst was seen as an act of aggression.','1',2,1,'hostility, violence','他突然的爆發被視為侵略行為。'),(8,'awareness','意識','n','Increased awareness about environmental issues is crucial.','1',2,1,'consciousness, realization','提升對環境問題的意識至關重要。'),(9,'balance','使平衡；使均衡','v','She learned to balance her time between work and her hobbies effectively.','1',2,1,'','她學會了有效地在工作和愛好之間平衡她的時間'),(10,'balance','平衡；天平；餘款；差額','n','Finding the right balance between work and leisure is essential.','1',2,1,'equilibrium, steadiness','找到工作和休閒之間的正確平衡是必需的。'),(11,'brochure','小冊子','n','This brochure explains all the features of the new car.','1',2,1,'pamphlet, leaflet','這本小冊子解釋了新車的所有特性。'),(12,'careless','粗心的；疏忽的','adj','His careless mistake cost the company thousands of dollars.','1',2,1,'negligent, reckless','他的粗心大意讓公司損失了數千美元。'),(13,'chimpanzee','黑猩猩','n','The chimpanzee shares over 98% of its DNA with humans.','1',2,1,'ape, gorilla','黑猩猩與人類共有超過98%的DNA。'),(14,'collective','集體的；共同的','adj','The workers formed a collective to negotiate better terms.','1',2,1,'joint, unified','工人們組成了一個集體以談判更好的條款。'),(15,'conductivity','傳導性','n','This material\'s high conductivity makes it perfect for electrical applications.','1',2,1,'resistivity, conductance','這種材料的高導電性使其非常適合電氣應用。'),(16,'ability','能力','n','His ability to solve complex problems is exceptional.','1',2,2,'competence, skill','他解決複雜問題的能力非常出色。'),(17,'accord','一致；符合','n','The two countries reached an accord to stop the fighting.','1',2,2,'agreement, treaty','兩國達成協議停止戰鬥。'),(18,'additive','添加的；加法的','adj','Food manufacturers sometimes add additives to prolong shelf life.','1',2,2,'supplement, enhancer','食品製造商有時會添加添加劑以延長保質期。'),(19,'affection','喜愛；情感；影響','n','She expressed her deep affection for her family.','1',2,2,'love, fondness','她表達了對家庭的深厚感情。'),(20,'alike','相同的；相似的','adj','These two theories are very much alike in their predictions.','1',2,2,'similar, comparable','這兩種理論在其預測上非常相似。'),(21,'alternately','交替地；輪流地；間隔地','adv','The traffic lights changed alternately, from red to green and back again.','1',2,2,'by turns, sequentially','交通燈交替變化，從紅燈變綠燈再變回去。'),(22,'behaviorism','行為主義','n','Behaviorism focuses on the study of observable behavior rather than mental states.','1',2,2,'psychology, Skinnerian','行為主義專注於觀察行為的研究，而不是心理狀態。'),(23,'biologist','生物學家','n','The biologist spent years studying the behavior of dolphins in the wild.','1',2,2,'ecologist, geneticist','這位生物學家花了多年時間研究野生海豚的行為。\r\n'),(24,'budget','預算','n','We need to tighten our budget to afford the new project.','1',2,2,'plan, finances','我們需要緊縮預算以資助新項目。\r\n'),(25,'calendar','日曆；月曆；日程表','n','Please mark the meeting date on your calendar.','1',2,2,'schedule, planner','請在你的日曆上標記會議日期。\r\n'),(26,'coil','捲；圈線','n','He placed a coil of rope in the corner of the shed.','1',2,2,'spiral, loop','他把一捲繩子放在小屋的角落。'),(27,'coil','盤繞','v','The cable coiled around the post as he wound it up.','1',2,2,'spiral, loop','當他將電纜捲起時，電纜繞在柱子周圍。\r\n'),(28,'colleague','同事','n','I will discuss the project details with my colleague tomorrow.','1',2,2,'associate, partner','我明天將與我的同事討論項目細節。'),(29,'composer','作曲家','n','The composer spent many nights working on his new symphony.','1',2,2,'musician, arranger','這位作曲家花了很多夜晚來創作他的新交響曲。\r\n'),(30,'additive','添加劑','n','Some food products contain additives to improve flavor or preservation.','1',2,2,'enhancer, preservative','一些食品中含有添加劑以增強風味或保存。\r\n'),(31,'accent','口音；重音','n','Her accent reveals that she is not a native speaker.','1',2,3,'pronunciation, inflection','她的口音透露出她不是本地人。\r\n'),(32,'admit','承認；准許進入','v','He admitted to making a mistake in the report.','1',2,3,'confess, acknowledge','他承認報告中犯了一個錯誤。\r\n'),(33,'alkali','鹼','n','Soap is a common alkali used in households.','1',2,3,'base, caustic','肥皂是家庭中常用的一種鹼。\r\n'),(34,'asymmetrical','不均勻的；不對稱的','adj','The building\'s design is strikingly asymmetrical, which makes it quite unique.','1',2,3,'uneven, unbalanced','這棟建築的設計非常不對稱，這使它非常獨特。'),(35,'authority','權威人士；權力；當局','n','The director has the authority to make the final decision on the script.','1',2,3,'power, command','導演有權對劇本做出最終決定。'),(36,'bargain','廉價貨；交易；協議','n','They struck a bargain at the local market, getting all the supplies at half price.','1',2,3,'deal, agreement','他們在當地市場達成了一筆交易，以半價獲得了所有用品。'),(37,'bargain','達成交易；議價','v','Unions bargain with employers for better rates of pay each year.','1',2,3,'negotiate','為了爭取更高薪酬，工會每年都要與資方進行談判。'),(38,'bony','瘦骨嶙峋的；消瘦的','adj','The skeleton was bony and fragile, clearly ancient.','1',2,3,'skeletal, thin','這副骨架多骨且脆弱，顯然是古老的。\r\n'),(39,'brief','簡短的；短暫的','adj','Please keep your explanation brief; we\'re running out of time.','1',2,3,'concise, succinct','請將你的解釋保持簡短；我們時間不多了。\r\n'),(40,'buddy','密友；夥伴','n','I met up with my old buddy from college over the weekend.','1',2,3,'friend, pal','週末我與大學時代的老朋友見面了。\r\n'),(41,'classic','經典的；典型的','adj','That song is considered a classic in the rock genre.','1',2,3,'traditional, typical','那首歌被認為是搖滾類型的經典之作。\r\n'),(42,'coarse','粗的；粗糙的','adj','The blanket was made of coarse wool, making it very durable.\r\n','1',2,3,'rough, gritty','這條毯子是用粗糙的羊毛製成的，非常耐用。'),(43,'communicate','通信；通訊；溝通','v','Effective leaders know how to communicate their vision clearly.\r\n','1',2,3,'talk, interact','有效的領導者知道如何清楚地溝通他們的願景。'),(44,'classic','經典作品；古典文學','n','That book is a classic; its lessons are timeless.','1',2,3,'','那本書是經典；它的教訓是永恆的。'),(45,'compare','比較；比作；對照','v','Compare the benefits of each option before making a decision.','1',2,3,'contrast, scrutinize','在做決定之前比較每個選項的好處。'),(46,'catastrophe','突如其來的大災難','n','The earthquake was a catastrophe, leaving the city in ruins.','1',2,3,'disaster, tragedy','地震是一場災難，使城市成為廢墟。'),(47,'congestion','壅塞','n','The congestion in the city center during rush hour is unbearable.','1',2,1,'traffic, blockage','尖峰時間城市中心的擁堵情況令人無法忍受。'),(48,'convince','使確信；說服','v','It took hours to convince her to change her mind.','1',2,1,'persuade, influence','她花了好幾個小時才說服她改變主意。'),(49,'council','理事會；委員會','n','The council will meet next week to discuss the new policy.','1',2,1,'assembly, panel','議會將於下週會面討論新政策。'),(50,'creivice','缺口；裂縫','n','Water seeped through the crevice in the rock.','1',2,1,'gap, fissure','水從岩石的裂縫中滲出。'),(51,'crossing','橫越；交叉路口','n','The pedestrian crossing was crowded with people.','1',2,1,'junction, interchange','行人過路處擠滿了人。'),(52,'curriculum','課程','n','The curriculum needs to be updated to make it more relevant.','1',2,1,'syllabus, education','課程需要更新，以使其更加相關。'),(53,'debate','辯論；爭論','v','The debate over climate change continues to intensify.','1',2,1,'argue, discuss','關於氣候變化的辯論持續加劇。'),(54,'deficiency','不足；缺乏','n','Vitamin C deficiency can lead to serious health problems.','1',2,1,'shortage, scarcity','維生素C缺乏可能導致嚴重的健康問題。'),(55,'devotion','熱愛；投入；獻身；奉獻','n','Her devotion to her family is evident in everything she does.','1',2,1,'commitment, loyalty','她對家庭的奉獻在她所做的一切中都很明顯。'),(56,'discharge','流出物；排出物；排出；放電','n','The factory was ordered to control its toxic discharge.','1',2,1,'release, emit','工廠被命令控制其有毒排放。'),(57,'dispute','爭論；糾紛','n','The dispute between the neighbors lasted for years.','1',2,1,'conflict, argument','鄰居之間的爭議持續了多年。'),(58,'diverse','不從的；多樣的','adj','New York is known for its diverse population.','1',2,1,'varied, mixed','紐約以其多樣化的人口而聞名。'),(59,'doctrine','教條；教義；學說','n','His beliefs are grounded in strict religious doctrine.','1',2,1,'belief, tenet','他的信仰基於嚴格的宗教教條。'),(60,'endless','無止境的','adj','The possibilities are endless if you\'re willing to think creatively.','1',2,1,'continuous, perpetual','如果你願意創造性地思考，可能性是無窮的。'),(61,'enforce','實施；執行；強迫','v','The new law will be strictly enforced starting next month.','1',2,1,'implement, apply','新法律將從下個月開始嚴格執行。'),(62,'essentially','本質上；基本上','adv','Essentially, we are facing a choice between action and complacency.','1',2,1,'fundamentally, basically','本質上，我們正面臨行動與自滿之間的選擇。\r\n'),(63,'expire','到期；死亡','v','The license will expire at the end of the year.','1',2,1,'terminate, conclude','許可證將在年底到期。'),(64,'fare','費用；票價','n','The taxi fare from the airport was quite reasonable.','1',2,1,'cost, charge','從機場的出租車票價相當合理。'),(65,'flat','平的；平坦的','adj','The road was flat and straight, perfect for driving.','1',2,1,'level, even','這條路平坦而直，非常適合駕駛。'),(66,'forward','向前；前進','adv','She always looks forward, never dwelling on the past.','1',2,1,'ahead, onward','她總是向前看，從不沉湎於過去。'),(67,'foul','骯髒的','adj','The referee called a foul on the player for an illegal tackle.','1',2,1,'dirty, offensive','裁判因球員進行非法擊球而判罰犯規。\r\n'),(68,'glow','發光','v','The glow from the fireplace created a warm, inviting atmosphere.','1',2,1,'shine, radiate\r\n','壁爐的光芒營造出一種溫暖、誘人的氛圍。\r\n'),(69,'honest','誠實的；正直的','adj','He is known for his honest dealings with everyone.','1',2,1,'truthful, sincere\r\n','他以與每個人的誠實交易而聞名。\r\n'),(70,'improve','改善；改進','v','We aim to continually improve our processes and products.\r\n','1',2,1,'enhance, better','我們旨在不斷改進我們的流程和產品。\r\n'),(71,'interest','興趣；利息；利益','n','Her interest in art began at a young age and has only grown since.\r\n','1',2,1,'fascination, attraction','她對藝術的興趣從小開始，並且自那以後只增不減。\r\n'),(72,'investigate','研究；調查','v','The police will investigate the incident thoroughly.\r\n','1',2,1,'examine, probe','警方將徹底調查這起事件。\r\n');
/*!40000 ALTER TABLE `Word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'wordspicker'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-17 16:42:18
