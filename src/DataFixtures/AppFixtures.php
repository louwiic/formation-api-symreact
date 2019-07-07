<?php

namespace App\DataFixtures;

/**
 * Class fixture permet de créer des objets à insérer dans la base de données pour avoir des données
 * fictif lors de la création d'une app
 * en complément avec le package Fake qui permet de générer des Fake user, facture ou autres..
 */

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use App\Entity\Utilisateur;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{   
    /**
     * L'encoder de mot de passe
     * 
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder )
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR'); // obj faker, récupére des fake user FR
       
        //On créer des utilisateurs qui eux mêmes on des clients avec des factures
        for ($u = 0; $u < 10; $u++) {
            
            $user = new Utilisateur();
            $chrono = 1; //représente le numero de facture incrémenté à la facture par utilisateur
            $hash = $this->encoder->encodePassword($user, "password"); //hash avec bcrypt

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            //génére à la voler des clients à insérer dans la base à partir de faker
            for ($c = 0; $c < mt_rand(5, 20); $c++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company);

                $manager->persist($customer);

                //Par la même occasion je génére des facture au client
                for ($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
