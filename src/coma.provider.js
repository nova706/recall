/**
 * The comaProvider is the entry point for common configuration options. Specific adapters may have their own
 * configuration options
 */
angular.module('coma').provider('coma', [
    function () {
        var config = {};

        // The default local adapter to use unless otherwise specified by the model Definition
        config.localAdapter = null;
        this.setLocalAdapter = function (localAdapter) {
            config.localAdapter = localAdapter;
            return this;
        };

        // The default remote adapter to use unless otherwise specified by the model Definition
        config.remoteAdapter = null;
        this.setRemoteAdapter = function (remoteAdapter) {
            config.remoteAdapter = remoteAdapter;
            return this;
        };

        // Time in milliseconds to throttle Entity dirty checking. This allows for multiple digest cycles to pass
        // between checking if an Entity is dirty by examining its stored state
        config.dirtyCheckThreshold = 30;
        this.setDirtCheckThreshold = function (dirtyCheckThreshold) {
            config.dirtyCheckThreshold = dirtyCheckThreshold;
            return this;
        };

        // The default last modified field name. To enable synchronization, this must be set.
        config.lastModifiedFieldName = null;
        this.setLastModifiedFieldName = function (lastModifiedFieldName) {
            config.lastModifiedFieldName = lastModifiedFieldName;
            return this;
        };

        // The default soft delete field name. To enable synchronization, this must be set.
        config.deletedFieldName = null;
        this.setDeletedFieldName = function (deletedFieldName) {
            config.deletedFieldName = deletedFieldName;
            return this;
        };

        this.$get = ['comaBaseModelService', function (comaBaseModelService) {
            var service = {
                config: config
            };

            // To Avoid circular dependency, add the config to the baseModelService
            comaBaseModelService.setDirtyCheckThreshold(config.dirtyCheckThreshold);
            comaBaseModelService.setLastModifiedFieldName(config.lastModifiedFieldName);
            comaBaseModelService.setDeletedFieldName(config.deletedFieldName);

            // Set the adapters
            if (config.localAdapter) {
                comaBaseModelService.setLocalAdapter(config.localAdapter);
            }
            if (config.remoteAdapter) {
                comaBaseModelService.setRemoteAdapter(config.remoteAdapter);
            }

            /*------------------------------ Alias methods exposed in the coma service -------------------------------*/

            /**
             * Get an array of the defined Models.
             * @returns {Entity[]} The models
             */
            service.getModels = comaBaseModelService.getModels;

            /**
             * Gets a defined model by its name
             * @param {String} modelName
             * @returns {Entity} The model or null if the model is not found
             */
            service.getModel = comaBaseModelService.getModel;

            /**
             * Creates a model based on a definition.
             * @param {Object} modelDefinition The definition of the model including fields and associations
             * @param {Object} [localAdapter] The adapter that is used to perform the CRUD actions locally
             * @param {Object} [remoteAdapter] The adapter that is used to perform the CRUD actions remotely
             * @returns {Entity} The model
             */
            service.defineModel = comaBaseModelService.defineModel;

            return service;
        }];
    }
]);