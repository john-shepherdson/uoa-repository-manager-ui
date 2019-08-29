
/* Service Down Message */
export const noServiceMessage = 'The service is not available at the moment.';

/* Repositories Messages */
export const loadingUserRepoInfoError = 'Failed to load information on your registered repositories';
export const loadingUserRepoInfoEmpty = 'You have not yet registered any repositories';
export const reposRetrievalError = 'The repositories can not be retrieved at the moment';
export const noRepositoriesFound = 'No Datasources were found';
export const loadingReposMessage = 'Retrieving repositories ...';
export const noRepositoryChosenMsg = 'You need to select a repository first.';
export const loadingRepoMessage = 'Retrieving repository information ...';
export const loadingRepoError = 'System error retrieving repository info';
export const loadingInterfacesError = 'System error retrieving interfaces';
export const loadingAggregationHistory = 'Retrieving aggregation history ...';
export const loadingAggregationHistoryError = 'System error retrieving repository aggregation history.';
export const noAggregationHistory = 'There is no aggregation history for this repository at the moment';

/* Interfaces Messages */
export const noInterfacesSaved = 'You have to create at least one interface.';
export const errorsInInterfaces = 'There are still invalid interfaces. Please correct or remove them.';
export const nonRemovableInterface = 'This interface can not be removed!';

/* Rules Messages */
export const loadingRuleSets = 'Retrieving sets of rules ...';
export const loadingRuleSetsError = 'The rule sets can not be retrieved at the moment';
export const noRuleSets = 'No rule sets were found';
export const noContentRulesResults = 'No content rules were tested';
export const noUsageRulesResults = 'No usage rules were tested';
export const didntSelectRules = 'You need to select at least one rule';
export const didntSelectCrisEntities = 'You need to select at least one entity';

/* Loading Validation Sets Messages */
export const loadingValSets = 'Retrieving validation sets ...';
export const loadingValSetsError = 'The validation sets can not be retrieved at the moment';

/* Jobs of User */
export const loadingUserJobs = 'Retrieving job results ...';
export const loadingUserJobsError = 'Your job results can not be retrieved at the moment';
export const noUserJobsFound = 'No stored jobs found';
export const loadingJobSummary = 'Retrieving job summary ...';
export const loadingJobSummaryError = 'The job summary can not be retrieved at the moment';
export const submittingJob = 'Submitting the new job';
export const submittingJobError = 'The job could not be submitted';


/* Loading Topics Messages */
export const loadingTopics = 'Retrieving topics for the datasource...';
export const loadingTopicsError = 'Failed to load the topics for your datasource';
export const noTopicsFound = 'No topics were found for this datasource';

/* Loading Events Messages */
export const loadingEvents = 'Retrieving events for topic ...';
export const loadingEventsError = 'Failed to retrieve events';
export const noEventsForTopic = 'No events were found for this topic';
export const noEventsWithParams = 'No events were found with the given parameters';

/* Loading Subscriptions Messages */
export const loadingSubscriptions = 'Retrieving subscriptions ...';
export const noSubscriptionsFound = 'No subscriptions found for your account';
export const deletingSubscription = 'Deleting subscription ...';
export const deletingSubscriptionError = 'Failed to delete your subscription';
export const deletingSubscriptionSuccess = 'The subscription was deleted successfully';
export const subscribingToEvents = 'Subscribing to events ...';
export const subscribingToEventsError = 'Failed to subscribe you to the chosen events';
export const subscribingToeventsSuccess = 'The subscription was submitted successfully';
export const subscribingChooseFrequency = 'Please choose a frequency for the notifications';

/* Piwik Messages */
export const loadingMetrics = 'Loading diagrams ...';
export const loadingMetricsError = 'Failed to load the metrics for this repository';
export const enablingMetrics = 'Enabling metrics for this repository...';
export const enabledMetricsSuccess = 'The metrics for this repository were enabled';
export const enabledMetricsError = 'System error enabling metrics for this repository.';
export const validatePiwikSiteSuccess = 'The piwik site was approved.';


/* Forms validation Messages */
export const formInfoLoading = 'Loading information';
export const formInterfacesLoading = 'Loading interfaces';
export const formSubmitting = 'Saving changes ...';
export const formErrorRequiredFields = 'All the fields marked with (*) are mandatory';
export const formErrorInvalidFields = 'There are invalid fields';
export const formErrorWasntSaved = 'The form could not be submitted';
let errorRegisterRepo = 'Due to an error, the registration can\'t be finished. ';
errorRegisterRepo = errorRegisterRepo + 'Please contact "helpdesk@openaire.eu" for support. ';
errorRegisterRepo = errorRegisterRepo + 'We\'re sorry for the inconvenience.';
export const formErrorRegisterRepo = errorRegisterRepo;
export const formSuccessUpdatedRepo = 'The datasource was updated successfully.';
export const formSuccessRegisteredDatasource = 'The datasource was registered successfully';
export const formSuccessAddedInterface = 'The interface was added successfully.';
export const formSuccessUpdatedInterface = 'The interface was updated successfully.';

/* BaseUrl validation Messages */
export const didntChooseBaseUrl = 'You need to select a base URL';
export const invalidCustomBaseUrl = 'The url is not responding or is not a valid OAI-PMH url. Please, make sure that you are using the correct protocol ("http" or "https"), as the service is currently unable to follow url redirects.';
export const identifyingUrl = 'Identifying Url ...';
