import { vulnerabilitySeverity, vulnerabilityStatus } from "@nuxthub/db/schema";

export const vulnerabilitySeverityEnum = vulnerabilitySeverity.enumValues;

export type VulnerabilitySeverity = (typeof vulnerabilitySeverityEnum)[number];

export const vulnerabilityStatusEnum = vulnerabilityStatus.enumValues;

export type VulnerabilityStatus = (typeof vulnerabilityStatusEnum)[number];
