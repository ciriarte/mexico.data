postgresql-server:
  pkg:
    - installed

systemctl enable postgresql-9.2:
  cmd.run

/usr/pgsql-9.2/bin/postgresql92-setup initdb:
  cmd.run

systemctl start postgresql-9.2:
  cmd.run