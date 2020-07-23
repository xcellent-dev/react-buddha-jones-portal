<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;

use Application\Entity\Users;
use Application\Entity\RediOrders;
use Application\Entity\RediOrderLines;
use Application\Entity\RediPendingReason;
use Application\Entity\RediOrderPendingReason;
use Application\Entity\RediUserCart;
use Application\Entity\RediUserCartInfo;
use Namshi\JOSE\SimpleJWS;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;

class CustomAbstractActionController extends AbstractRestfulController
{
    protected $_identity;
    protected $_jwt_public_key_path;
    protected $_user_id;
    protected $_profileImagePath;
    protected $_tempProfileImagePath;
    protected $_siteUrl;

    protected $_em;
    protected $_conn;

    protected $_userRepository;
    protected $_activityRepository;
    protected $_billingRepository;
    protected $_billingApprovalRepository;
    protected $_campaignRepository;
    protected $_commentRepository;
    protected $_commentTypeRepository;
    protected $_customerRepository;
    protected $_customerPriceRepository;
    protected $_customerContactRepository;
    protected $_customerContactToProjectCampaignRepository;
    protected $_editorToSpotRepository;
    protected $_estimateRepository;
    protected $_estimateToOutsideCostRepository;
    protected $_estimateTypeRepository;
    protected $_estimateToWorkerRepository;
    protected $_estimateTemporaryStaffRepository;
    protected $_outsideCostRepository;
    protected $_projectRepository;
    protected $_projectEditorProgressRepository;
    protected $_projectToCampaignRepository;
    protected $_projectCampaignManagerRepository;
    protected $_projectCampaignProducerRepository;
    protected $_spotRepository;
    protected $_spotSentRepository;
    protected $_spotSentViaMethodRepository;
    protected $_spotSentToWorkStage;
    protected $_spotVersionRepository;
    protected $_statusRepository;
    protected $_timeEntryRepository;
    protected $_versionRepository;
    protected $_userTypeRepository;
    protected $_workTypeRepository;
    protected $_workStageRepository;

    protected $_activityRepo;
    protected $_billingRepo;
    protected $_campaignRepo;
    protected $_commentRepo;
    protected $_customerRepo;
    protected $_estimateRepo;
    protected $_projectRepo;
    protected $_spotRepo;
    protected $_timeEntryRepo;
    protected $_usersRepo;
    protected $_versionRepo;

    public function onDispatch(MvcEvent $e)
    {
        $auth = $this->getServiceLocator()->get('Zend\Authentication\AuthenticationService');

        // get configuration values
        $config = $this->getServiceLocator()->get('Config');
        $this->_jwt_public_key_path = $config['jwt_config']['public_key_path'];
        $this->_profileImagePath = $config['directory_path']['profile_image'];
        $this->_tempProfileImagePath = $config['directory_path']['temp_profile_image'];
        $this->_siteUrl = $config['site_url'];

//        $this->_conn = $this->getServiceManager()->get('doctrine.entitymanager.orm_default')->getConnection();
        $this->_em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->_userRepository = $this->_em->getRepository('Application\Entity\RediUser');
        $this->_billingRepository = $this->_em->getRepository('Application\Entity\RediBilling');
        $this->_billingApprovalRepository = $this->_em->getRepository('Application\Entity\RediBillingApproval');
        $this->_activityRepository = $this->_em->getRepository('Application\Entity\RediActivity');
        $this->_campaignRepository = $this->_em->getRepository('Application\Entity\RediCampaign');
        $this->_commentRepository = $this->_em->getRepository('Application\Entity\RediComment');
        $this->_commentTypeRepository = $this->_em->getRepository('Application\Entity\RediCommentType');
        $this->_customerRepository = $this->_em->getRepository('Application\Entity\RediCustomer');
        $this->_customerContactRepository = $this->_em->getRepository('Application\Entity\RediCustomerContact');
        $this->_customerContactToProjectCampaignRepository = $this->_em->getRepository('Application\Entity\RediCustomerContactToProjectCampaign');
        $this->_customerPriceRepository = $this->_em->getRepository('Application\Entity\RediCustomerPrice');
        $this->_editorToSpotRepository = $this->_em->getRepository('Application\Entity\RediEditorToSpot');
        $this->_estimateToOutsideCostRepository = $this->_em->getRepository('Application\Entity\RediEstimateToOutsideCost');
        $this->_estimateRepository = $this->_em->getRepository('Application\Entity\RediEstimate');
        $this->_estimateTemporaryStaffRepository = $this->_em->getRepository('Application\Entity\RediEstimateTemporaryStaff');
        $this->_estimateTypeRepository = $this->_em->getRepository('Application\Entity\RediEstimateType');
        $this->_estimateToWorkerRepository = $this->_em->getRepository('Application\Entity\RediEstimateToWorker');
        $this->_outsideCostRepository = $this->_em->getRepository('Application\Entity\RediOutsideCost');
        $this->_projectRepository = $this->_em->getRepository('Application\Entity\RediProject');
        $this->_projectEditorProgressRepository = $this->_em->getRepository('Application\Entity\RediProjectEditorProgress');
        $this->_projectToCampaignRepository = $this->_em->getRepository('Application\Entity\RediProjectToCampaign');
        $this->_projectCampaignManagerRepository = $this->_em->getRepository('Application\Entity\RediProjectCampaignManager');
        $this->_projectCampaignProducerRepository = $this->_em->getRepository('Application\Entity\RediProjectCampaignProducer');
        $this->_spotRepository = $this->_em->getRepository('Application\Entity\RediSpot');
        $this->_spotVersionRepository = $this->_em->getRepository('Application\Entity\RediSpotVersion');
        $this->_spotSentViaMethodRepository = $this->_em->getRepository('Application\Entity\RediSpotSentViaMethod');
        $this->_spotSentRepository = $this->_em->getRepository('Application\Entity\RediSpotSent');
        $this->_spotSentToWorkStage = $this->_em->getRepository('Application\Entity\RediSpotSentToWorkStage');
        $this->_statusRepository = $this->_em->getRepository('Application\Entity\RediStatus');
        $this->_timeEntryRepository = $this->_em->getRepository('Application\Entity\RediTimeEntry');
        $this->_versionRepository = $this->_em->getRepository('Application\Entity\RediVersion');
        $this->_userTypeRepository = $this->_em->getRepository('Application\Entity\RediUserType');
        $this->_workTypeRepository = $this->_em->getRepository('Application\Entity\RediWorkType');
        $this->_workStageRepository = $this->_em->getRepository('Application\Entity\RediWorkStage');

        $this->_activityRepo = $this->getServiceLocator()->get('Application\Entity\Repository\ActivityRepository');
        $this->_billingRepo = $this->getServiceLocator()->get('Application\Entity\Repository\BillingRepository');
        $this->_campaignRepo = $this->getServiceLocator()->get('Application\Entity\Repository\CampaignRepository');
        $this->_commentRepo = $this->getServiceLocator()->get('Application\Entity\Repository\CommentRepository');
        $this->_customerRepo = $this->getServiceLocator()->get('Application\Entity\Repository\CustomerRepository');
        $this->_estimateRepo = $this->getServiceLocator()->get('Application\Entity\Repository\EstimateRepository');
        $this->_projectRepo = $this->getServiceLocator()->get('Application\Entity\Repository\ProjectRepository');
        $this->_spotRepo = $this->getServiceLocator()->get('Application\Entity\Repository\SpotRepository');
        $this->_timeEntryRepo = $this->getServiceLocator()->get('Application\Entity\Repository\TimeEntryRepository');
        $this->_usersRepo = $this->getServiceLocator()->get('Application\Entity\Repository\UsersRepository');
        $this->_versionRepo = $this->getServiceLocator()->get('Application\Entity\Repository\VersionRepository');

        $this->getResponse()->getHeaders()
            // can be accessed by origin
            ->addHeaderLine('Access-Control-Allow-Origin', '*')
            // set allow methods
            ->addHeaderLine('Access-Control-Allow-Methods', 'POST,PUT,DELETE,GET,OPTIONS')
            // set allow headers
            ->addHeaderLine('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
            // allow credentials
            ->addHeaderLine('Access-Control-Allow-Credential', 'true');

        if ($this->getRequest()->getMethod() != 'OPTIONS') {

            $auth = $this->getRequest()->getHeaders('Authorization');
            if ($auth) {
                $authFailed = false;
                $token = str_replace('Bearer ', '', $auth->getFieldValue());

                if ($this->_checkTokenFormat($token)) {
                    $jws = SimpleJWS::load($token);


                    $public_key = openssl_pkey_get_public($this->_jwt_public_key_path);

                    if ($jws->isValid($public_key, 'RS256')) {

                        $payload = $jws->getPayload();
                        $this->_user_id = (int)$payload['sub'];
                    } else {
                        $authFailed = true;
                    }
                } else {
                    $authFailed = true;
                }

                if ($authFailed) {
                    $response = new JsonModel(array(
                        'status' => 0,
                        'message' => "User authentication failed",
                        'auth_error' => 1
                    ));
                    $e->stopPropagation(true);
                    $e->setViewModel($response);

                    $this->getResponse()->setStatusCode(401);
                    return $response;
                } else {
                    // check user permission for the navigation item
                    $path = explode('/', $this->getRequest()->getUri()->getPath());
                    if(isset($path[1])) {
//                        $checkNavigationPermission = $this->_navigationRepo->checkNavigationPermission($this->_user_id, $path[1]);

//                        if(!$checkNavigationPermission) {
//                            $response = new JsonModel(array(
//                                'status' => 0,
//                                'message' => "User does not have access ",
//                                'auth_error' => 1
//                            ));
//                            $e->stopPropagation(true);
//                            $e->setViewModel($response);
//
//                            $this->getResponse()->setStatusCode(401);
//                            return $response;
//                        }
                    }
                }

            } else {
                $response = new JsonModel(array(
                    'status' => 0,
                    'message' => "User authentication failed",
                    'auth_error' => 1
                ));
                $e->stopPropagation(true);
                $e->setViewModel($response);

                $this->getResponse()->setStatusCode(401);
                return $response;
            }

            return parent::onDispatch($e);
        }

        return parent::onDispatch($e);

    }

    public function options()
    {
        $response = $this->getResponse();
        $headers = $response->getHeaders();

        $headers->addHeaderLine('Allow', implode(',', array(
            'GET',
            'POST',
            'PUT',
            'OPTIONS'
        )));
        return $response;
    }

    private function _checkTokenFormat($jwsTokenString, $encoder = null)
    {
        if ($encoder === null) {
            $encoder = strpbrk($jwsTokenString, '+/=') ? new Base64Encoder() : new Base64UrlSafeEncoder();
        }

        $parts = explode('.', $jwsTokenString);

        if (count($parts) === 3) {
            $header = json_decode($encoder->decode($parts[0]), true);
            $payload = json_decode($encoder->decode($parts[1]), true);

            if (is_array($header) && is_array($payload)) {
                return true;
            }
        }
        return false;
    }

    public function processAmount($amount) {
        $amountValue = (float)preg_replace('/[^0-9\.-]+/i', '', $amount);

        if (preg_match("/\(.+\)/i", $amount, $match)) {
            $value = -$amountValue;
        } else {
            $value = $amountValue;
        }
        
        return $value;
    }
}
