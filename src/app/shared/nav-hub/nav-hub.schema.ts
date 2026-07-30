export interface NavHubItem<T extends string = string> {
  id: T;
  title: string;
  subtitle?: string;
}
