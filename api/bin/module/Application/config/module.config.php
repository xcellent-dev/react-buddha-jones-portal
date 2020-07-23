<?php

namespace Application;

return array(
    'router' => array(
        'routes' => array(
            'application' => array(
                'type' => 'Literal',
                'options' => array(
                    'route' => '/',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Application\Controller',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => ':controller[/:id][/:param1][/:param2][/:param3][/:param4][/]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ),
                            'defaults' => array(
                                'action' => null
                            )
                        ),
                    ),
                ),
            ),
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions' => true,
        'doctype' => 'HTML5',
        'not_found_template' => 'error/404',
        'exception_template' => 'error/index',
        'template_map' => array(
            'layout/layout' => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404' => __DIR__ . '/../view/error/404.phtml',
            'error/index' => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',

            'Application\Entity\Repository\BillingRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\BillingRepository($entityManager);
            },
             'Application\Entity\Repository\BillingApproveRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\BillingApproveRepository($entityManager);
            },
            'Application\Entity\Repository\CommonRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\CommonRepository($entityManager);
            },
            'Application\Entity\Repository\CustomerRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\CustomerRepository($entityManager);
            },
            'Application\Entity\Repository\UsersRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\UsersRepository($entityManager);
            },
            'Application\Entity\Repository\PermissionRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\PermissionRepository($entityManager);
            },
            'Application\Entity\Repository\ProjectRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\ProjectRepository($entityManager);
            },
            'Application\Entity\Repository\ActivityRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\ActivityRepository($entityManager);
            },
            'Application\Entity\Repository\CampaignRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\CampaignRepository($entityManager);
            },
            'Application\Entity\Repository\CommentRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\CommentRepository($entityManager);
            },
            'Application\Entity\Repository\SpotRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\SpotRepository($entityManager);
            },
            'Application\Entity\Repository\TimeEntryRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\TimeEntryRepository($entityManager);
            },
            'Application\Entity\Repository\EstimateRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\EstimateRepository($entityManager);
            },
            'Application\Entity\Repository\VersionRepository' => function ($serviceManager) {
                $entityManager = $serviceManager->get('Doctrine\ORM\EntityManager');
                return new \Application\Entity\Repository\VersionRepository($entityManager);
            },
        ),
    ),
//    'translator' => array(
//        'locale' => 'en_US',
//        'translation_file_patterns' => array(
//            array(
//                'type' => 'gettext',
//                'base_dir' => __DIR__ . '/../language',
//                'pattern' => '%s.mo',
//            ),
//        ),
//    ),
    'controllers' => array(
        'invokables' => array(
            'Application\Controller\Activity'                                       => 'Application\Controller\ActivityController',
            'Application\Controller\ActivityLevel'                                  => 'Application\Controller\ActivityLevelController',
            'Application\Controller\ActivityPrice'                                  => 'Application\Controller\ActivityPriceController',
            'Application\Controller\AssignCampaignToProject'                        => 'Application\Controller\AssignCampaignToProjectController',
            'Application\Controller\AssignManagementToCampaign'                     => 'Application\Controller\AssignManagementToCampaignController',
            'Application\Controller\AssignCustomerContactToProjectCampaign'         => 'Application\Controller\AssignCustomerContactToProjectCampaignController',
            'Application\Controller\AssignVersionToSpot'                            => 'Application\Controller\AssignVersionToSpotController',
            'Application\Controller\AssignSpotToCampaign'                           => 'Application\Controller\AssignSpotToCampaignController',
            'Application\Controller\Billing'                                        => 'Application\Controller\BillingController',
            'Application\Controller\BillingApprove'                                 => 'Application\Controller\BillingApproveController',
            'Application\Controller\BillingStatus'                                  => 'Application\Controller\BillingStatusController',
            'Application\Controller\Campaign'                                       => 'Application\Controller\CampaignController',
            'Application\Controller\Comment'                                        => 'Application\Controller\CommentController',
            'Application\Controller\CommentType'                                    => 'Application\Controller\CommentTypeController',
            'Application\Controller\Customer'                                       => 'Application\Controller\CustomerController',
            'Application\Controller\CustomerContact'                                => 'Application\Controller\CustomerContactController',
            'Application\Controller\EditorProject'                                  => 'Application\Controller\EditorProjectController',
            'Application\Controller\EditorProjectProgress'                          => 'Application\Controller\EditorProjectProgressController',
            'Application\Controller\EditorProjectStatus'                            => 'Application\Controller\EditorProjectStatusController',
            'Application\Controller\Estimate'                                       => 'Application\Controller\EstimateController',
            'Application\Controller\EstimateType'                                   => 'Application\Controller\EstimateTypeController',
            'Application\Controller\EstimateTemporaryStaffSearch'                   => 'Application\Controller\EstimateTemporaryStaffSearchController',
            'Application\Controller\Index'                                          => 'Application\Controller\IndexController',
            'Application\Controller\Login'                                          => 'Application\Controller\LoginController',
            'Application\Controller\LoginRefresh'                                   => 'Application\Controller\LoginRefreshController',
            'Application\Controller\Logout'                                         => 'Application\Controller\LogoutController',
            'Application\Controller\OutsideCost'                                    => 'Application\Controller\OutsideCostController',
            'Application\Controller\PasswordReset'                                  => 'Application\Controller\PasswordResetController',
            'Application\Controller\Project'                                        => 'Application\Controller\ProjectController',
            'Application\Controller\Spot'                                           => 'Application\Controller\SpotController',
            'Application\Controller\SpotSent'                                       => 'Application\Controller\SpotSentController',
            'Application\Controller\SpotSentValidate'                               => 'Application\Controller\SpotSentValidateController',
            'Application\Controller\SpotSentViaMethod'                              => 'Application\Controller\SpotSentViaMethodController',
            'Application\Controller\Status'                                         => 'Application\Controller\StatusController',
            'Application\Controller\TimeEntry'                                      => 'Application\Controller\TimeEntryController',
            'Application\Controller\TimeEntryOfUser'                                => 'Application\Controller\TimeEntryOfUserController',
            'Application\Controller\TimeEntrySubmitForReview'                       => 'Application\Controller\TimeEntrySubmitForReviewController',
            'Application\Controller\User'                                           => 'Application\Controller\UserController',
            'Application\Controller\Users'                                          => 'Application\Controller\UsersController',
            'Application\Controller\UserType'                                       => 'Application\Controller\UserTypeController',
            'Application\Controller\Version'                                        => 'Application\Controller\VersionController',
            'Application\Controller\WorkStage'                                      => 'Application\Controller\WorkStageController',
            'Application\Controller\WorkType'                                       => 'Application\Controller\WorkTypeController',
        ),
    ),
    // Placeholder for console routes
//    'console' => array(
//        'router' => array(
//            'routes' => array(),
//        ),
//    ),

    'doctrine' => array(
        // 1) for Aithentication
        'authentication' => array( // this part is for the Auth adapter from DoctrineModule/Authentication
            'orm_default' => array(
                'object_manager' => 'Doctrine\ORM\EntityManager',
                // object_repository can be used instead of the object_manager key
                'identity_class' => 'Application\Entity\RediUser',
                'identity_property' => 'username',
                'credential_property' => 'password',
                'credential_callable' => function(\Application\Entity\RediUser $user, $password) {
                    if ($user->getPassword() == md5($password) && $user->getStatus() == 1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            ),
        ),

        // 2) standard configuration for the ORM from https://github.com/doctrine/DoctrineORMModule
        // http://www.jasongrimes.org/2012/01/using-doctrine-2-in-zend-framework-2/
        // ONLY THIS IS REQUIRED IF YOU USE Doctrine in the module
        'driver' => array(
            // defines an annotation driver with two paths, and names it `my_annotation_driver`
//            'my_annotation_driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(
                    // __DIR__ . '/../module/Auth/src/Auth/Entity' // 'path/to/my/entities',
                    __DIR__ . '/../src/' . __NAMESPACE__ . '/Entity',
                    // 'H:\PortableApps\PortableGit\projects\btk\module\Auth\src\Auth\Entity' // Stoyan added to use doctrine in Auth module
//-					__DIR__ . '/../../Auth/src/Auth/Entity', // Stoyan added to use doctrine in Auth module
                    // 'another/path'
                ),
            ),

            // default metadata driver, aggregates all other drivers into a single one.
            // Override `orm_default` only if you know what you're doing
            'orm_default' => array(
                'drivers' => array(
                    // register `my_annotation_driver` for any entity under namespace `My\Namespace`
                    // 'My\Namespace' => 'my_annotation_driver'
                    // 'Auth' => 'my_annotation_driver'
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver',
//-					'Auth\Entity' => __NAMESPACE__ . '_driver' // Stoyan added to allow the module Auth also to use Doctrine
                )
            )
        )
    ),
);
