<?php

namespace Application\Controller;

use Zend\View\Model\JsonModel;

use Application\Entity\RediUser;
use Application\Entity\RediNavigationPermission;

class UserTypeController extends CustomAbstractActionController
{
    public function getList()
    {
        $userType = $this->_userTypeRepository->findAll();

        $data = array();

        foreach($userType as $row) {
            $data[] = array(
                'id' => $row->getId(),
                'type_name' => $row->getTypeName()
            );
        }

        $response = array(
            'status' => 1,
            'message' => 'Request successful',
            'data' => $data
        );


        return new JsonModel($response);
    }

}
