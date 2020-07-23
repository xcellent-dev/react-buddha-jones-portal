<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;
use Zend\Mail;
use Namshi\JOSE\SimpleJWS;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;

class LoginRefreshController extends AbstractRestfulController
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

                    $jws = new SimpleJWS(array(
                        'typ' => 'JWT',
                        'alg' => 'RS256'
                    ));

                    $jws->setPayload(array(
                        'iss' => 'Buddha Jones',
                        'iat' => time(),
                        'exp' => time() + 2400, //86400,
                        'sub' => $userId
                    ));

                    $private_key = openssl_pkey_get_private($this->_config['jwt_config']['private_key_path'], $this->_config['jwt_config']['password']);
                    $jws->sign($private_key);

                    $response = array(
                        'status' => 1,
                        'message' => "User login time extended",
                        'data' => array(
                            'token' => $jws->getTokenString()
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
        $this->getResponse()->setStatusCode(404);
        return new JsonModel(array('status' => 0, 'message' => 'no response'));
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
