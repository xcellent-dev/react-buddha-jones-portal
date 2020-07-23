<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;
use Zend\Mail;
use Namshi\JOSE\SimpleJWS;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;

class LoginController extends AbstractRestfulController
{
    protected $_em;

    protected $_userRepository;
    protected $_userTypeRepository;

    private $_config;

    public function onDispatch(MvcEvent $e)
    {
        $this->_em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->_userRepository = $this->_em->getRepository('Application\Entity\RediUser');
        $this->_userTypeRepository = $this->_em->getRepository('Application\Entity\RediUserType');

        $this->_config = $this->getServiceLocator()->get('Config');

        $this->getResponse()->getHeaders()
            // can be accessed by origin
            ->addHeaderLine('Access-Control-Allow-Origin', '*')
            // set allow methods
            ->addHeaderLine('Access-Control-Allow-Methods', 'POST,PUT,DELETE,GET,OPTIONS')
            // set allow headers
            ->addHeaderLine('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
            // allow credentials
            ->addHeaderLine('Access-Control-Allow-Credential', 'true');


        return parent::onDispatch($e);
    }

    /**
     * check user logged in or not
     *
     * @return mixed|JsonModel
     */
    public function getList()
    {
        $config = $this->getServiceLocator()->get('Config');
        $jwt_public_key_path = $config['jwt_config']['public_key_path'];
        $authFailed = false;

        $auth = $this->getRequest()->getHeaders('Authorization');

        if ($auth) {
            $authFailed = false;
            $token = str_replace('Bearer ', '', $auth->getFieldValue());

            if ($this->_checkTokenFormat($token)) {
                $jws = SimpleJWS::load($token);


                $public_key = openssl_pkey_get_public($jwt_public_key_path);

                if ($jws->isValid($public_key, 'RS256')) {
                    $payload = $jws->getPayload();
                    $userId = (int)$payload['sub'];
//                    $permission = $this->_permissionRepo->getPermission($userId);

                    $user = $this->_userRepository->find($userId);
                    $userType = $this->_userTypeRepository->find($user->getTypeId());

                    $response = array(
                        'status' => 1,
                        'message' => "User already logged in",
                        'data' => array(
                            'user_id' => $user->getId(),
                            'username' => $user->getUsername(),
                            'email' => $user->getEmail(),
                            'first_name' => $user->getFirstName(),
                            'last_name' => $user->getLastName(),
                            'full_name' => trim(implode(' ', array($user->getFirstName(), $user->getLastName()))),
                            'image' => ($user->getImage())?$this->_config['site_url'] . 'thumb/profile_image/' . $user->getImage():null,
                            'type_id' => $userType->getId(),
                            'type_name' => $userType->getTypeName(),
                            'hourly_rate' => $user->getHourlyRate(),
                            'salary_type' => $user->getSalaryType(),
                            'salary_amount' => $user->getSalaryAmount(),
                            'min_hour' => $user->getMinHour(),
                            'status' => $user->getStatus(),
                        )
                    );
                } else {
                    $authFailed = true;
                }
            } else {
                $authFailed = true;
            }

        }

        if (!$auth || $authFailed) {
            $response = array(
                'status' => 0,
                'message' => "User authentication failed",
                'auth_error' => 1
            );

            $this->getResponse()->setStatusCode(401);
        }

        return new JsonModel($response);
    }

    public function get($id)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function update($id, $data)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function delete($id)
    {
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
    }

    public function create($data)
    {
        $authService = $this->getServiceLocator()->get('Zend\Authentication\AuthenticationService');

        $username = trim($this->getRequest()->getPost('username', ''));
        $password = trim($this->getRequest()->getPost('password', ''));
        $authFailed = 0;

        if ($username && $password) {
            $adapter = $authService->getAdapter();

            $adapter->setIdentity($username);
            $adapter->setCredential($password);
            $authResult = $authService->authenticate();

            if ($authResult->isValid()) {
                $identity = $authResult->getIdentity();
                $authService->getStorage()->write($identity);

                if ($identity->getStatus()) {

                    $jws = new SimpleJWS(array(
                        'typ' => 'JWT',
                        'alg' => 'RS256'
                    ));

                    $jws->setPayload(array(
                        'iss' => 'AmeriFleet Portal',
                        'iat' => time(),
                        'exp' => time() + 86400,
                        'sub' => $identity->getId()
                    ));

                    $private_key = openssl_pkey_get_private($this->_config['jwt_config']['private_key_path'], $this->_config['jwt_config']['password']);
                    $jws->sign($private_key);

//                    $permission = $this->_navigationRepo->getUserNavigation($identity->getUserId());
//                    $allowedNavigation = $this->_navigationRepo->getUserNavigationPermission($identity->getUserId());


                    //$this->_permissionRepo->getPermission($identity->getUserId());
                    $userType = $this->_userTypeRepository->find($identity->getTypeId());


                    $data = array(
                        'user_id' => $identity->getId(),
                        'username' => $identity->getUsername(),
                        'email' => $identity->getEmail(),
                        'first_name' => $identity->getFirstName(),
                        'last_name' => $identity->getLastName(),
                        'full_name' => trim(implode(' ', array($identity->getFirstName(), $identity->getLastName()))),
                        'image' => ($identity->getImage())?$this->_config['site_url'] . 'thumb/profile_image/' . $identity->getImage():null,
                        'type_id' => $userType->getId(),
                        'type_name' => $userType->getTypeName(),
                        'hourly_rate' => $identity->getHourlyRate(),
                        'salary_type' => $identity->getSalaryType(),
                        'salary_amount' => $identity->getSalaryAmount(),
                        'min_hour' => $identity->getMinHour(),
                        'token' => $jws->getTokenString(),
                        'status' => $identity->getStatus(),
                    );


                    $response = array(
                        'status' => 1,
                        'message' => 'Login successful',
                        'data' => $data
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'User is inactive',
                    );
                }
            } else {
                $authFailed = 1;
                $checkUserName = $this->_userRepository->findOneBy(array('username' => $username));

                if($checkUserName) {
                    $response = array(
                        'status' => 0,
                        'message' => 'User name and password does not match'
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'User does not exist'
                    );
                }
            }

        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data'
            );
        }


        if ($response['status'] == 0) {
            if($authFailed==1) {
                $this->getResponse()->setStatusCode(401);
            } else {
                $this->getResponse()->setStatusCode(400);
            }
        }

        return new JsonModel($response);
    }

    public function options()
    {
        $response = $this->getResponse();
        $headers = $response->getHeaders();

        $headers->addHeaderLine('Allow', implode(',', array(
            'GET',
            'POST',
            'PUT'
        )));
        return $response;
    }

    private function _generateToken($length = 50)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
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

}
