<?php
namespace Application\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;
use Zend\Config\Config;

// before called Table now Repository Table Data Gateway
// In Bug Entity add  @Entity(repositoryClass="BugRepository")
// To be able to use this query logic through
// $this->getEntityManager()->getRepository('Bug') we have to adjust the metadata slightly.
// http://stackoverflow.com/questions/10481916/the-method-name-must-start-with-either-findby-or-findoneby-uncaught-exception

class CommonRepository extends EntityRepository
{
    private $_className = "\Application\Entity\RediActivity";

    private $_config;

    public function __construct(EntityManager $entityManager)
    {
        $classMetaData = $entityManager->getClassMetadata($this->_className);
        parent::__construct($entityManager, $classMetaData);

        $this->_config = new Config(include 'config/autoload/global.php');
    }

//    public function callSync($type)
//    {
//        $url = $this->_config->sync_data->url;
//
//        $post = [
//            'token1' => $this->_config->sync_data->token1,
//            'token2' => $this->_config->sync_data->token2,
//            'type' => $type,
//        ];
//
//        $ch = curl_init($url);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($ch,CURLOPT_POST, count($post));
//        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
//
//        $response = curl_exec($ch);
//
//        // var_dump($response);
//        curl_close($ch);
//    }

    public function generateRandomString($minLength=10, $maxLength=100) {
        $length = rand($minLength, $maxLength);
        $str = "";
        $characters = array_merge(range('A','Z'), range('a','z'), range('0','9'));
        $max = count($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $rand = mt_rand(0, $max);
            $str .= $characters[$rand];
        }
        return $str;
    }
}
