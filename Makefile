SHELL := /bin/bash

.PHONY: build-SignUpFunction build-SignInFunction build-RefreshTokenFunction build-ForgotPasswordFunction build-ResetPasswordFunction build-CreateUserFunction build-ListUsersFunction build-GetUserFunction build-UpdateUserFunction build-DeleteUserFunction build-DeleteManyUsersFunction build-CreateQuotationFunction build-ListQuotationsFunction build-GetQuotationFunction build-UpdateQuotationFunction build-DeleteQuotationFunction build-DeleteManyQuotationsFunction build-CreateComplainFunction build-ListComplainsFunction build-GetComplainFunction build-UpdateComplainFunction build-DeleteComplainFunction build-CreateContactUsFunction build-ListContactUsFunction build-GetContactUsFunction build-DeleteContactUsFunction build-ListLocalitiesFunction build-GetLocalityFunction build-ListLOVFunction build-GetLOVFunction build-ListRolesFunction build-GetRoleFunction

# Default target for all functions
build-%:
	cp -r node_modules $(ARTIFACTS_DIR)/node_modules 2>/dev/null || true
	cp -r dist/src $(ARTIFACTS_DIR)/src
