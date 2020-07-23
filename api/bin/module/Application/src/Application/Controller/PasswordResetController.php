<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\Mime\Message as MimeMessage;
use Zend\Mime\Part as MimePart;
use Zend\Mail\Message as MailMessage;
use Zend\Mime\Mime;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\SmtpOptions;


class PasswordResetController extends AbstractRestfulController
{
    protected $_em;
    protected $_userRepository;

    protected $_commonRepo;

    public function onDispatch(MvcEvent $e)
    {
        $this->_em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->_userRepository = $this->_em->getRepository('Application\Entity\RediUser');

        $this->_commonRepo = $this->getServiceLocator()->get('Application\Entity\Repository\CommonRepository');


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

    public function get($token)
    {
        $checkToken = $this->_userRepository->findOneBy(array('resetToken' => $token));

        if($checkToken) {
            $password = $this->_commonRepo->generateRandomString(6, 8);
            $email = $checkToken->getEmail();

            $checkToken->setPassword(md5($password));
            $checkToken->setResetToken(null);
            $this->_em->persist($checkToken);
            $this->_em->flush();

            $this->_sendEmail('send_password', $email, null, $password);

            $response = array(
                'status' => 1,
                'message' => 'Request successful',
//            'data' => $data
            );
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Invalid token',
//            'data' => $data
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    public function create($data)
    {
        $email = trim(isset($data['email']) ? $data['email'] : '');
        $baseUrl = trim(isset($data['url']) ? $data['url'] : '');

        if ($email && $baseUrl) {
            $user = $this->_userRepository->findOneBy(array('email' => $email));

            if(!$user) {
                $user = $this->_userRepository->findOneBy(array('username' => $email));
            }

            if($user) {
                $emailAddress = $user->getEmail();

                if($emailAddress) {
                    while(1) {
                        $randomToken = $this->_commonRepo->generateRandomString(10, 30);

                        $checkToken = $this->_userRepository->findOneBy(array('resetToken' => $randomToken));

                        if(!$checkToken) {
                            break;
                        }
                    }

                    $user->setResetToken($randomToken);
                    $this->_em->persist($user);
                    $this->_em->flush();

                    $baseUrl = $baseUrl . $randomToken;

                    $this->_sendEmail('reset_link', $emailAddress, $baseUrl);

                    $response = array(
                        'status' => 1,
                        'message' => 'Request successful.'
                    );
                } else {
                    $response = array(
                        'status' => 0,
                        'message' => 'User does not have email address.'
                    );
                }
            } else {
                $response = array(
                    'status' => 0,
                    'message' => 'User not found.'
                );
            }
        } else {
            $response = array(
                'status' => 0,
                'message' => 'Please provide required data (email (or user name), url).'
            );
        }

        if ($response['status'] == 0) {
            $this->getResponse()->setStatusCode(400);
        }

        return new JsonModel($response);
    }

    private function _sendEmail($type, $email, $baseUrl = null, $password = null) {
        if ($email) {
            $validator = new \Zend\Validator\EmailAddress();
            if ($validator->isValid($email)) {
                // email appears to be valid
                $view       = new \Zend\View\Renderer\PhpRenderer();
                $resolver   = new \Zend\View\Resolver\TemplateMapResolver();

                if ($type=='reset_link') {
                    $templateFile = __DIR__ . '/../../../view/email/password-reset-link.phtml';
                    $subject = "Password reset request";
                    $data = array(
                        'baseUrl' => $baseUrl
                    );
                } else {
                    $templateFile = __DIR__ . '/../../../view/email/password-reset-validate.phtml';
                    $subject = "Password changed";
                    $data = array(
                        'password' => $password
                    );
                }

                $view       = new \Zend\View\Renderer\PhpRenderer();
                $resolver   = new \Zend\View\Resolver\TemplateMapResolver();
                $resolver->setMap(array(
                    'mailTemplate' => $templateFile
                ));
                $view->setResolver($resolver);

                $viewModel  = new ViewModel();
                $viewModel->setTemplate('mailTemplate')->setVariables($data);

                $bodyPart = new \Zend\Mime\Message();
                $bodyMessage    = new \Zend\Mime\Part($view->render($viewModel));
                $bodyMessage->type = 'text/html';
                $bodyPart->setParts(array($bodyMessage));

                $message        = new \Zend\Mail\Message();
                $message->addFrom('noreply@buddhajones.com', 'Buddha Jones')
                        ->addTo($email)
                        ->setSubject($subject)
                        ->setBody($bodyPart)
                        ->setEncoding('UTF-8');
                $transport  = new \Zend\Mail\Transport\Sendmail();
                $transport->send($message);
            }

        }
    }
}
