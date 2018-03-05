'use strict'

angular.module('ParkingSpaceMobile.controllers').controller('PayCtrl', function ($rootScope, $scope, $state, $stateParams, replaceById, paymentService) {


    $scope.offer = $stateParams.offer;
    let elm = $('#paymentRoot');

    $('.start-payment').hide();


    paymentService.generateToken().then(function (token) {
        let container = elm.find('.dropin-container').get(0);
        let button = elm.find('.start-payment').get(0);
        braintree.dropin.create({
            authorization: token,
            container: container,
            translations: {
                payingWith: 'Metodă plată: {{paymentSource}}',
                chooseAnotherWayToPay: 'Alege altă metodă de plată',
                chooseAWayToPay: 'Alege o metodă de plată',
                otherWaysToPay: 'Alte metode de plată',
                cardVerification: 'Verificare card',
                // Errors
                fieldEmptyForCvv: 'Vă rugăm completați CVV.',
                fieldEmptyForExpirationDate: 'Vă rugăm completați data expirării.',
                fieldEmptyForCardholderName: 'Vă rugăm completați numele deținatorului.',
                fieldEmptyForNumber: 'Va rugăm completați numarul cardului.',
                fieldEmptyForPostalCode: 'Va rugăm completați codul poștal.',
                fieldInvalidForCvv: 'Codul de securitate este invalid.',
                fieldInvalidForExpirationDate: 'Data expirării este invalidă.',
                fieldInvalidForNumber: 'Numarul cardului este invalid.',
                fieldInvalidForPostalCode: 'Codul poștal este invalid.',
                fieldTooLongForCardholderName: 'Numele deținătorului nu poate depașii 256 caractere.',
                genericError: 'A apărut o eroare in procesare.',
                hostedFieldsFailedTokenizationError: 'Vă rugăm verificați informațiile si încercați din nou.',
                hostedFieldsTokenizationCvvVerificationFailedError: 'Verificarea cardului a eșuat. Verificați informațiile și încercați din nou.',
                hostedFieldsTokenizationNetworkErrorError: 'Eroare de rețea. Vă rugăm incercați din nou.',
                hostedFieldsFieldsInvalidError: 'Vă rugăm verificați informațiile si încercați din nou.',
                paypalAccountTokenizationFailedError: 'A aparut o eroare in adaugarea contului de PayPal. Încercați din nou.',
                paypalFlowFailedError: 'A apărut o eroare la conectarea cu PayPal. Încercați din nou.',
                paypalTokenizationRequestActiveError: 'Autorizarea plății prin PayPal este deja pornită.',
                applePayTokenizationError: 'O eroare de rețea a aparut la procesarea Apple Pay. Încercați din nou.',
                applePayActiveCardError: 'Add a supported card to your Apple Pay wallet.',
                unsupportedCardTypeError: 'Acest tip de card nu este suportat. Vă rugăm folosiți alt card.',
                // Card form
                cardholderNameLabel: 'Nume deținător',
                cardholderNamePlaceholder: 'Nume deținător',
                cardNumberLabel: 'Număr card',
                expirationDateLabel: 'Dată expirare',
                postalCodeLabel: 'Cod poștal',
                payWithCard: 'Plată cu cardul',
                endingIn: 'Ultimele cifre ••{{lastTwoCardDigits}}',
            }
        }, function (createErr, instance) {
            $('.start-payment').show();
            $('#loadingSpinner').hide();
            $scope.dropin = instance;
            button.addEventListener('click', function () {
                $scope.loading = true;

                instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {

                    if (requestPaymentMethodErr) {
                        // No payment method is available.
                        // An appropriate error will be shown in the UI.
                        alert('Eroare in procesare:' + requestPaymentMethodErr);
                        return;
                    }

                    paymentService.registerPayment(payload, $scope.selectedSpace.id, $scope.offer.id, function (respData) {
                        $scope.loading = false;
                        replaceById(respData, $scope.selectedSpace.offers);
                        replaceById(respData, $scope.selectedSpace.userOffers);
                        $state.go('^');
                        $rootScope.$emit('http.notif', 'Ați achitat cu succes rezervarea. Proprietarul a fost notificat.')
                    }, function (errResp) {
                        $state.go('^');
                        $scope.loading = false;
                    });
                });
            });
        })
    });

    $scope.$on('$stateChangeStart', function (event, toState) {
        if (toState.name.indexOf('pay') === -1 ) {
            if ( $scope.dropin){
                $scope.dropin.teardown();
                $scope.dropin = null;
            }
        }
    });
});

