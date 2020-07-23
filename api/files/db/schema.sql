-- MySQL dump 10.13  Distrib 5.7.13, for linux-glibc2.5 (x86_64)
--
-- Host: localhost    Database: buddha_jones
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_log`
--

DROP TABLE IF EXISTS `api_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_log` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `api` varchar(200) DEFAULT NULL,
  `post_data` text,
  `get_data` text,
  `response` text,
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_activity`
--

DROP TABLE IF EXISTS `redi_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_activity` (
  `id` int(22) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `user_type_id` int(11) DEFAULT NULL,
  `status` smallint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_activity_type`
--

DROP TABLE IF EXISTS `redi_activity_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_activity_type` (
  `id` int(22) NOT NULL AUTO_INCREMENT,
  `activity_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_activity_type_to_activity`
--

DROP TABLE IF EXISTS `redi_activity_type_to_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_activity_type_to_activity` (
  `activity_type_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_type_id`,`activity_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_billing`
--

DROP TABLE IF EXISTS `redi_billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_billing` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `spot_id` int(11) DEFAULT NULL,
  `notes` text,
  `status_id` smallint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_billing_activity`
--

DROP TABLE IF EXISTS `redi_billing_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_billing_activity` (
  `bill_id` bigint(22) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `price` decimal(19,2) DEFAULT NULL,
  `hour` decimal(19,2) DEFAULT NULL,
  PRIMARY KEY (`bill_id`,`activity_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_billing_approval`
--

DROP TABLE IF EXISTS `redi_billing_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_billing_approval` (
  `bill_id` bigint(22) NOT NULL,
  `user_id` int(11) NOT NULL,
  `approved` smallint(1) DEFAULT '0',
  PRIMARY KEY (`bill_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_billing_estimate`
--

DROP TABLE IF EXISTS `redi_billing_estimate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_billing_estimate` (
  `bill_id` bigint(22) NOT NULL,
  `estimate_id` int(11) NOT NULL,
  PRIMARY KEY (`bill_id`,`estimate_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_billing_status`
--

DROP TABLE IF EXISTS `redi_billing_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_billing_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_campaign`
--

DROP TABLE IF EXISTS `redi_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_campaign` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `campaign_name` varchar(22) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_comment`
--

DROP TABLE IF EXISTS `redi_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_comment` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `comment` text,
  `user_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `comment_read` smallint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_comment_type`
--

DROP TABLE IF EXISTS `redi_comment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_comment_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_customer`
--

DROP TABLE IF EXISTS `redi_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_customer_contact`
--

DROP TABLE IF EXISTS `redi_customer_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_customer_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile_phone` varchar(20) DEFAULT NULL,
  `office_phone` varchar(20) DEFAULT NULL,
  `postal_address` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_customer_contact_to_project_campaign`
--

DROP TABLE IF EXISTS `redi_customer_contact_to_project_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_customer_contact_to_project_campaign` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `customer_contact_id` int(11) DEFAULT NULL,
  `project_to_campaign_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_customer_price`
--

DROP TABLE IF EXISTS `redi_customer_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_customer_price` (
  `customer_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `price` decimal(19,2) DEFAULT NULL,
  PRIMARY KEY (`customer_id`,`activity_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_editor_to_spot`
--

DROP TABLE IF EXISTS `redi_editor_to_spot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_editor_to_spot` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `editor_id` int(11) DEFAULT NULL COMMENT 'editor user id',
  `spot_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_employee_time_approver`
--

DROP TABLE IF EXISTS `redi_employee_time_approver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_employee_time_approver` (
  `emp_id` int(11) NOT NULL,
  `approver_employee_id` int(11) NOT NULL,
  PRIMARY KEY (`emp_id`,`approver_employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_estimate`
--

DROP TABLE IF EXISTS `redi_estimate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_estimate` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `spot_id` int(11) DEFAULT NULL,
  `version_id` int(11) DEFAULT NULL,
  `multiplier` int(11) DEFAULT NULL,
  `notes` text,
  `submitted_to` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `total_amount` decimal(19,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_estimate_history`
--

DROP TABLE IF EXISTS `redi_estimate_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_estimate_history` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `estimate_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_estimate_to_worker`
--

DROP TABLE IF EXISTS `redi_estimate_to_worker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_estimate_to_worker` (
  `estimate_id` bigint(22) NOT NULL,
  `worker_id` int(11) NOT NULL,
  `hourly_rate` decimal(19,2) DEFAULT NULL,
  `estimated_regular_hours` decimal(19,2) DEFAULT NULL,
  `estimated_overtime_hour` decimal(19,2) DEFAULT NULL,
  `estimated_doubletime_hour` decimal(19,2) DEFAULT NULL,
  `total_amount` decimal(19,2) DEFAULT NULL,
  PRIMARY KEY (`estimate_id`,`worker_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project`
--

DROP TABLE IF EXISTS `redi_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(200) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `first_point_of_contact_id` int(11) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_campaign_manager`
--

DROP TABLE IF EXISTS `redi_project_campaign_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_campaign_manager` (
  `project_campaign_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  PRIMARY KEY (`project_campaign_id`,`manager_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_campaign_producer`
--

DROP TABLE IF EXISTS `redi_project_campaign_producer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_campaign_producer` (
  `project_campaign_id` int(11) NOT NULL,
  `producer_id` int(11) NOT NULL,
  PRIMARY KEY (`project_campaign_id`,`producer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_editor_progress`
--

DROP TABLE IF EXISTS `redi_project_editor_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_editor_progress` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `spot_id` int(11) DEFAULT NULL,
  `notes` text,
  `watched` smallint(1) DEFAULT NULL,
  `broken_down` smallint(6) DEFAULT NULL,
  `due` varchar(200) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_editor_status`
--

DROP TABLE IF EXISTS `redi_project_editor_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_editor_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_history`
--

DROP TABLE IF EXISTS `redi_project_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_history` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_manager`
--

DROP TABLE IF EXISTS `redi_project_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_manager` (
  `project_id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`manager_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_producer`
--

DROP TABLE IF EXISTS `redi_project_producer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_producer` (
  `project_id` int(11) NOT NULL,
  `producer_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`,`producer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_project_to_campaign`
--

DROP TABLE IF EXISTS `redi_project_to_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_project_to_campaign` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=115 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot`
--

DROP TABLE IF EXISTS `redi_spot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `spot_name` varchar(22) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `revision_not_counted` smallint(1) DEFAULT NULL,
  `notes` text,
  `revisions` int(11) DEFAULT NULL,
  `graphics_revisions` smallint(1) DEFAULT NULL,
  `first_revision_cost` decimal(19,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent`
--

DROP TABLE IF EXISTS `redi_spot_sent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `work_type_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `sent_via_method_id` int(11) DEFAULT NULL,
  `notes` text,
  `status_id` int(11) DEFAULT NULL,
  `final` smallint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_file`
--

DROP TABLE IF EXISTS `redi_spot_sent_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_file` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `spot_sent_id` bigint(22) DEFAULT NULL,
  `file_name` varchar(200) DEFAULT NULL,
  `file_description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_to_customer_contact`
--

DROP TABLE IF EXISTS `redi_spot_sent_to_customer_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_to_customer_contact` (
  `spot_sent_id` bigint(22) NOT NULL,
  `customer_contact_id` int(11) NOT NULL,
  PRIMARY KEY (`spot_sent_id`,`customer_contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_to_spot_version`
--

DROP TABLE IF EXISTS `redi_spot_sent_to_spot_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_to_spot_version` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `spot_sent_id` bigint(22) DEFAULT NULL,
  `spot_id` bigint(22) DEFAULT NULL,
  `version_id` bigint(22) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_to_spot_version_to_editor_designer`
--

DROP TABLE IF EXISTS `redi_spot_sent_to_spot_version_to_editor_designer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_to_spot_version_to_editor_designer` (
  `spot_sent_spot_version_id` bigint(22) NOT NULL,
  `editor_designer_id` int(11) NOT NULL,
  PRIMARY KEY (`spot_sent_spot_version_id`,`editor_designer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_to_work_stage`
--

DROP TABLE IF EXISTS `redi_spot_sent_to_work_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_to_work_stage` (
  `spot_sent_id` bigint(22) NOT NULL,
  `work_stage_id` int(11) NOT NULL,
  PRIMARY KEY (`spot_sent_id`,`work_stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_sent_via_method`
--

DROP TABLE IF EXISTS `redi_spot_sent_via_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_sent_via_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `work_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_spot_version`
--

DROP TABLE IF EXISTS `redi_spot_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_spot_version` (
  `spot_id` int(11) NOT NULL,
  `version_id` int(11) NOT NULL,
  `billing_type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`spot_id`,`version_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_status`
--

DROP TABLE IF EXISTS `redi_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_time_entry`
--

DROP TABLE IF EXISTS `redi_time_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_time_entry` (
  `id` bigint(22) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `version_id` int(11) DEFAULT NULL,
  `spot_id` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `duration` decimal(19,2) DEFAULT NULL,
  `activity_type_id` int(11) DEFAULT NULL,
  `activity_description` text,
  `notes` text,
  `non_billable` smallint(1) DEFAULT NULL COMMENT '0/1',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_user`
--

DROP TABLE IF EXISTS `redi_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(40) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `initials` varchar(20) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `token_created` datetime DEFAULT NULL,
  `reset_token` varchar(100) DEFAULT NULL,
  `hourly_rate` decimal(19,2) DEFAULT NULL,
  `salary_type` char(1) DEFAULT NULL COMMENT 'h=hourly, s=salary',
  `salary_amount` decimal(19,2) DEFAULT NULL,
  `min_hour` int(11) DEFAULT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `status` smallint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_user_type`
--

DROP TABLE IF EXISTS `redi_user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_user_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_version`
--

DROP TABLE IF EXISTS `redi_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_work_stage`
--

DROP TABLE IF EXISTS `redi_work_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_work_stage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `work_stage` varchar(100) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redi_work_type`
--

DROP TABLE IF EXISTS `redi_work_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redi_work_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `work_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'buddha_jones'
--

--
-- Dumping routines for database 'buddha_jones'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-26  2:20:59
